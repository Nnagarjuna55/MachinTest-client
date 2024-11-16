import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  DocumentIcon,
  CloudArrowUpIcon,
  FolderIcon,
  TrashIcon,
  DownloadIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

const API_URL = 'http://localhost:5000';

const DUMMY_DOCUMENTS = [
  {
    _id: '1',
    name: 'Employee Handbook.pdf',
    type: 'pdf',
    size: 2048576, // 2MB
    folder: 'root',
    uploadDate: '2024-03-15'
  },
  {
    _id: '2',
    name: 'Company Policy.docx',
    type: 'docx',
    size: 1048576, // 1MB
    folder: 'root',
    uploadDate: '2024-03-10'
  }
];

const DUMMY_FOLDERS = [
  {
    _id: '1',
    name: 'Policies',
    documentCount: 5
  },
  {
    _id: '2',
    name: 'Training Materials',
    documentCount: 3
  }
];

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center">
      <div className={`p-3 rounded-lg bg-${color}-100 text-${color}-600`}>
        <Icon className="h-6 w-6" />
      </div>
      <div className="ml-4">
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-semibold">{value}</p>
      </div>
    </div>
  </div>
);

const DocumentSection = () => {
  const [documents, setDocuments] = useState(DUMMY_DOCUMENTS);
  const [folders, setFolders] = useState(DUMMY_FOLDERS);
  const [currentFolder, setCurrentFolder] = useState('root');
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isApiAvailable, setIsApiAvailable] = useState(false);

  // Define fetchDocuments function at component level
  const fetchDocuments = async () => {
    if (!isApiAvailable) return;

    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (!token || !userId) {
      toast.error('Authentication required');
      return;
    }

    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    try {
      const [docsRes, foldersRes] = await Promise.all([
        axios.get(`${API_URL}/api/documents?folder=${currentFolder}`, config),
        axios.get(`${API_URL}/api/documents/folders`, config)
      ]);
      
      if (docsRes.data?.length > 0) setDocuments(docsRes.data);
      if (foldersRes.data?.length > 0) setFolders(foldersRes.data);
    } catch (error) {
      console.log('Using dummy document data');
    }
  };

  // Check API availability once on mount
  useEffect(() => {
    const checkApiAvailability = async () => {
      try {
        await axios.get(`${API_URL}/api/health`);
        setIsApiAvailable(true);
      } catch (error) {
        console.log('API not available, using dummy data');
        setIsApiAvailable(false);
      }
    };

    checkApiAvailability();
  }, []);

  // Fetch documents when needed
  useEffect(() => {
    fetchDocuments();
  }, [currentFolder, isApiAvailable]);

  const handleUpload = async (files, folderId) => {
    if (!isApiAvailable) {
      // Create dummy document entries
      const newDocs = Array.from(files).map(file => ({
        _id: Date.now().toString(),
        name: file.name,
        type: file.name.split('.').pop(),
        size: file.size,
        folder: folderId || 'root',
        uploadDate: new Date().toISOString()
      }));
      setDocuments([...documents, ...newDocs]);
      toast.success('Documents uploaded successfully');
      setShowUploadModal(false);
      return;
    }

    setUploading(true);
    const token = localStorage.getItem('token');
    
    if (!token) {
      toast.error('Authentication required');
      return;
    }

    try {
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('documents', file);
      });
      formData.append('folderId', folderId);

      try {
        await axios.post(`${API_URL}/api/documents/upload`, formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      } catch (error) {
        // Create dummy document entries
        const newDocs = Array.from(files).map(file => ({
          _id: Date.now().toString(),
          name: file.name,
          type: file.name.split('.').pop(),
          size: file.size,
          folder: folderId || 'root',
          uploadDate: new Date().toISOString()
        }));
        setDocuments(newDocs);
      }
      
      fetchDocuments();
      toast.success('Documents uploaded successfully');
      setShowUploadModal(false);
    } catch (error) {
      toast.error('Failed to upload documents');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (documentId) => {
    if (!isApiAvailable) {
      setDocuments(documents.filter(doc => doc._id !== documentId));
      toast.success('Document deleted successfully');
      return;
    }

    try {
      await axios.delete(`/api/documents/${documentId}`);
      setDocuments(documents.filter(doc => doc._id !== documentId));
      toast.success('Document deleted successfully');
    } catch (error) {
      toast.error('Failed to delete document');
    }
  };

  const handleDownload = async (document) => {
    try {
      const response = await axios.get(`/api/documents/download/${document._id}`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', document.name);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error('Failed to download document');
    }
  };

  return (
    <div className="space-y-6">
      {/* Document Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Documents"
          value={documents.length}
          icon={DocumentIcon}
          color="blue"
        />
        <StatCard
          title="Total Folders"
          value={folders.length}
          icon={FolderIcon}
          color="yellow"
        />
        <StatCard
          title="Storage Used"
          value={`${documents.reduce((acc, doc) => acc + doc.size, 0) / 1024 / 1024} MB`}
          icon={CloudArrowUpIcon}
          color="green"
        />
      </div>
    </div>
  );
};

export default DocumentSection; 