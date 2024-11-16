import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  UsersIcon,
  PhoneIcon,
  EnvelopeIcon,
  ChatBubbleLeftIcon,
  ArrowDownTrayIcon as DownloadIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

const TeamSection = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [folders, setFolders] = useState([]);

  // Fetch team data
  useEffect(() => {
    const fetchTeamData = async () => {
      setIsLoading(true);
      try {
        const [membersRes, deptsRes] = await Promise.all([
          axios.get('/api/team/members'),
          axios.get('/api/team/departments')
        ]);
        setTeamMembers(membersRes.data);
        setDepartments(deptsRes.data);
      } catch (error) {
        toast.error('Failed to fetch team data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTeamData();
  }, []);

  // Filter team members
  const filteredMembers = teamMembers.filter(member => {
    const departmentMatch = selectedDepartment === 'all' || member.department === selectedDepartment;
    const searchMatch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       member.position.toLowerCase().includes(searchQuery.toLowerCase());
    return departmentMatch && searchMatch;
  });

  const handleDownload = async (id) => {
    // Implementation
  };

  const handleDelete = async (id) => {
    // Implementation
  };

  const handleUpload = async (files) => {
    // Implementation
  };

  return (
    <div className="space-y-6">
      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Team Members"
          value={teamMembers.length}
          icon={UsersIcon}
          color="blue"
        />
        <StatCard
          title="Departments"
          value={departments.length}
          icon={PhoneIcon}
          color="yellow"
        />
        <StatCard
          title="Storage Used"
          value={`${teamMembers.reduce((acc, member) => acc + member.storageUsed, 0) / 1024 / 1024} MB`}
          icon={EnvelopeIcon}
          color="green"
        />
      </div>

      {/* Team Directory */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-semibold">Team Directory</h2>
              {selectedDepartment !== 'all' && (
                <button
                  onClick={() => setSelectedDepartment('all')}
                  className="text-sm text-indigo-600 hover:text-indigo-800"
                >
                  Back to All
                </button>
              )}
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-indigo-700"
            >
              <ChatBubbleLeftIcon className="h-5 w-5" />
              <span>Add Member</span>
            </button>
          </div>

          {/* Departments Grid */}
          {selectedDepartment === 'all' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {departments.map(department => (
                <button
                  key={department._id}
                  onClick={() => setSelectedDepartment(department._id)}
                  className="p-4 border rounded-lg hover:bg-gray-50 flex flex-col items-center"
                >
                  <PhoneIcon className="h-12 w-12 text-yellow-500" />
                  <span className="mt-2 text-sm font-medium">{department.name}</span>
                  <span className="text-xs text-gray-500">
                    {department.memberCount} members
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Team Members Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Storage Used
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMembers.map(member => (
                  <tr key={member._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <UsersIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm font-medium">{member.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {member.position}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {(member.storageUsed / 1024).toFixed(2)} KB
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleDownload(member)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <DownloadIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(member._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          onUpload={handleUpload}
          folders={folders}
          uploading={uploading}
        />
      )}
    </div>
  );
};

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

const UploadModal = ({ onClose, onUpload, folders, uploading }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState('root');

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpload(selectedFiles, selectedFolder);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Upload Documents</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Select Folder
            </label>
            <select
              value={selectedFolder}
              onChange={(e) => setSelectedFolder(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300"
            >
              <option value="root">Root</option>
              {folders.map(folder => (
                <option key={folder._id} value={folder._id}>
                  {folder.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Select Files
            </label>
            <input
              type="file"
              multiple
              onChange={(e) => setSelectedFiles(e.target.files)}
              className="mt-1 block w-full"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeamSection; 