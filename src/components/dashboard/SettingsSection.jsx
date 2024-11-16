import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  BellIcon,
  KeyIcon,
  UserCircleIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  SwatchIcon,
} from '@heroicons/react/24/outline';

const SettingToggle = ({ label, description, enabled, onChange }) => (
  <div className="flex items-center justify-between">
    <div>
      <h3 className="text-sm font-medium text-gray-900">{label}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
    <button
      className={`
        relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent
        transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
        ${enabled ? 'bg-indigo-600' : 'bg-gray-200'}
      `}
      onClick={() => onChange(!enabled)}
    >
      <span
        className={`
          pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0
          transition duration-200 ease-in-out
          ${enabled ? 'translate-x-5' : 'translate-x-0'}
        `}
      />
    </button>
  </div>
);

const SettingsSection = () => {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      announcements: true,
      taskUpdates: true,
      leaveRequests: true,
    },
    privacy: {
      showProfile: true,
      showEmail: true,
      showPhone: false,
    },
    appearance: {
      theme: 'light',
      fontSize: 'medium',
      compactMode: false,
    },
    language: 'en',
  });

  const [loading, setLoading] = useState(false);

  // Fetch user settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get('/api/settings');
        setSettings(response.data);
      } catch (error) {
        toast.error('Failed to fetch settings');
      }
    };
    fetchSettings();
  }, []);

  // Update settings
  const handleSettingChange = async (category, setting, value) => {
    try {
      setSettings(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          [setting]: value
        }
      }));

      await axios.patch('/api/settings', {
        category,
        setting,
        value
      });

      toast.success('Settings updated successfully');
    } catch (error) {
      toast.error('Failed to update settings');
    }
  };

  // Change password
  const handlePasswordChange = async (currentPassword, newPassword) => {
    try {
      await axios.post('/api/auth/change-password', {
        currentPassword,
        newPassword
      });
      toast.success('Password changed successfully');
    } catch (error) {
      toast.error('Failed to change password');
    }
  };

  return (
    <div className="space-y-6">
      {/* Notification Settings */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <BellIcon className="h-6 w-6 text-gray-400" />
            <h2 className="text-xl font-semibold">Notification Settings</h2>
          </div>
          <div className="space-y-4">
            <SettingToggle
              label="Email Notifications"
              description="Receive notifications via email"
              enabled={settings.notifications.email}
              onChange={(value) => handleSettingChange('notifications', 'email', value)}
            />
            <SettingToggle
              label="Push Notifications"
              description="Receive push notifications in browser"
              enabled={settings.notifications.push}
              onChange={(value) => handleSettingChange('notifications', 'push', value)}
            />
            <SettingToggle
              label="Announcements"
              description="Receive company announcement notifications"
              enabled={settings.notifications.announcements}
              onChange={(value) => handleSettingChange('notifications', 'announcements', value)}
            />
            <SettingToggle
              label="Task Updates"
              description="Receive notifications for task updates"
              enabled={settings.notifications.taskUpdates}
              onChange={(value) => handleSettingChange('notifications', 'taskUpdates', value)}
            />
            <SettingToggle
              label="Leave Requests"
              description="Receive notifications for leave request updates"
              enabled={settings.notifications.leaveRequests}
              onChange={(value) => handleSettingChange('notifications', 'leaveRequests', value)}
            />
          </div>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <ShieldCheckIcon className="h-6 w-6 text-gray-400" />
            <h2 className="text-xl font-semibold">Privacy Settings</h2>
          </div>
          <div className="space-y-4">
            <SettingToggle
              label="Show Profile"
              description="Make your profile visible to team members"
              enabled={settings.privacy.showProfile}
              onChange={(value) => handleSettingChange('privacy', 'showProfile', value)}
            />
            <SettingToggle
              label="Show Email"
              description="Display your email address to team members"
              enabled={settings.privacy.showEmail}
              onChange={(value) => handleSettingChange('privacy', 'showEmail', value)}
            />
            <SettingToggle
              label="Show Phone Number"
              description="Display your phone number to team members"
              enabled={settings.privacy.showPhone}
              onChange={(value) => handleSettingChange('privacy', 'showPhone', value)}
            />
          </div>
        </div>
      </div>

      {/* Appearance Settings */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <SwatchIcon className="h-6 w-6 text-gray-400" />
            <h2 className="text-xl font-semibold">Appearance</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Theme
              </label>
              <select
                value={settings.appearance.theme}
                onChange={(e) => handleSettingChange('appearance', 'theme', e.target.value)}
                className="mt-1 block w-full"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Font Size
              </label>
              <select
                value={settings.appearance.fontSize}
                onChange={(e) => handleSettingChange('appearance', 'fontSize', e.target.value)}
                className="mt-1 block w-full"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Compact Mode
              </label>
              <input
                type="checkbox"
                checked={settings.appearance.compactMode}
                onChange={(e) => handleSettingChange('appearance', 'compactMode', e.target.checked)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Language Settings */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <GlobeAltIcon className="h-6 w-6 text-gray-400" />
            <h2 className="text-xl font-semibold">Language</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Language
              </label>
              <select
                value={settings.language}
                onChange={(e) => handleSettingChange('language', 'language', e.target.value)}
                className="mt-1 block w-full"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="zh">Chinese</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsSection; 