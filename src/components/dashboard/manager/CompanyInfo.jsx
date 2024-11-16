import React from 'react';
import { BuildingOfficeIcon, MapPinIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

const CompanyInfo = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium mb-4">Company Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Company Details */}
          <div>
            <h3 className="text-md font-medium mb-4">Company Details</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm font-medium">Company Name</p>
                  <p className="text-sm text-gray-500">Your Company Name</p>
                </div>
              </div>
              <div className="flex items-center">
                <MapPinIcon className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm font-medium">Address</p>
                  <p className="text-sm text-gray-500">123 Business Street</p>
                </div>
              </div>
              <div className="flex items-center">
                <PhoneIcon className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm font-medium">Contact</p>
                  <p className="text-sm text-gray-500">+1 234 567 8900</p>
                </div>
              </div>
              <div className="flex items-center">
                <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-gray-500">contact@company.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Company Policies */}
          <div>
            <h3 className="text-md font-medium mb-4">Company Policies</h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium mb-2">Working Hours</h4>
                <p className="text-sm text-gray-500">Monday - Friday: 9:00 AM - 5:00 PM</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium mb-2">Leave Policy</h4>
                <p className="text-sm text-gray-500">20 days annual leave + public holidays</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyInfo; 