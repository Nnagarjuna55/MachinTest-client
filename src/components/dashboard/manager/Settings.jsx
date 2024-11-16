import React, { useState } from 'react';
import { CogIcon, BellIcon, LockClosedIcon } from '@heroicons/react/24/outline';

const Settings = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    weekly: false
  });

  const handleNotificationChange = (type) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium mb-4">Settings</h2>
        
        {/* Notifications Settings */}
        <div className="mb-8">
          <h3 className="text-md font-medium mb-4 flex items-center">
            <BellIcon className="h-5 w-5 mr-2" />
            Notification Preferences
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Email Notifications</p>
                <p className="text-sm text-gray-500">Receive notifications via email</p>
              </div>
              <button
                onClick={() => handleNotificationChange('email')}
                className={`${
                  notifications.email ? 'bg-indigo-600' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}
              >
                <span
                  className={`${
                    notifications.email ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out mt-1`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Push Notifications</p>
                <p className="text-sm text-gray-500">Receive push notifications</p>
              </div>
              <button
                onClick={() => handleNotificationChange('push')}
                className={`${
                  notifications.push ? 'bg-indigo-600' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}
              >
                <span
                  className={`${
                    notifications.push ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out mt-1`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div>
          <h3 className="text-md font-medium mb-4 flex items-center">
            <LockClosedIcon className="h-5 w-5 mr-2" />
            Security Settings
          </h3>
          <div className="space-y-4">
            <button className="w-full text-left px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100">
              <p className="text-sm font-medium">Change Password</p>
              <p className="text-sm text-gray-500">Update your password</p>
            </button>
            <button className="w-full text-left px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100">
              <p className="text-sm font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-gray-500">Add an extra layer of security</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 