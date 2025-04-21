import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  BuildingOfficeIcon,
  NewspaperIcon,
  DocumentTextIcon,
  CalendarIcon,
  MegaphoneIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';

const CompanySection = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [events, setEvents] = useState([]);
  const [companyInfo, setCompanyInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch company data
  useEffect(() => {
    const fetchCompanyData = async () => {
      setIsLoading(true);
      try {
        const [announcementsRes, policiesRes, eventsRes, infoRes] = await Promise.all([
          axios.get('/api/company/announcements'),
          axios.get('/api/company/policies'),
          axios.get('/api/company/events'),
          axios.get('/api/company/info')
        ]);
        setAnnouncements(announcementsRes.data);
        setPolicies(policiesRes.data);
        setEvents(eventsRes.data);
        setCompanyInfo(infoRes.data);
      } catch (error) {
        toast.error('Failed to fetch company data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCompanyData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Company Overview */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-4 mb-6">
          <img
            src='/NSTechno.png'
            alt="Company Logo"
            className="h-16 w-16 object-contain"
          />
          <div>
            <h1 className="text-2xl font-bold">{companyInfo?.name}</h1>
            <p className="text-gray-500">{companyInfo?.tagline}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-2">About Us</h3>
            <p className="text-gray-600">{companyInfo?.about}</p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Contact Information</h3>
            <div className="space-y-2 text-gray-600">
              <p className="flex items-center">
                <BuildingOfficeIcon className="mr-2 h-4 w-4" />
                {companyInfo?.address}
              </p>
              <p className="flex items-center">
                <NewspaperIcon className="mr-2 h-4 w-4" />
                {companyInfo?.email}
              </p>
              <p className="flex items-center">
                <DocumentTextIcon className="mr-2 h-4 w-4" />
                {companyInfo?.phone}
              </p>
              <p className="flex items-center">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {companyInfo?.website}
              </p>
              <p className="flex items-center">
                <MegaphoneIcon className="mr-2 h-4 w-4" />
                {companyInfo?.socialMedia}
              </p>
              <p className="flex items-center">
                <MapPinIcon className="mr-2 h-4 w-4" />
                {companyInfo?.location}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanySection; 