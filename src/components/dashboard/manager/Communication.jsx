import React, { useState } from 'react';
import { ChatBubbleLeftIcon, UserGroupIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

const Communication = ({ teamMembers }) => {
  const [selectedChannel, setSelectedChannel] = useState('team');
  const [message, setMessage] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    // Implement message sending logic here
    setMessage('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium mb-4">Team Communication</h2>
        
        {/* Channel Selection */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setSelectedChannel('team')}
            className={`px-4 py-2 rounded-lg ${
              selectedChannel === 'team' 
                ? 'bg-indigo-100 text-indigo-700' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <UserGroupIcon className="h-5 w-5 inline mr-2" />
            Team Chat
          </button>
          <button
            onClick={() => setSelectedChannel('announcements')}
            className={`px-4 py-2 rounded-lg ${
              selectedChannel === 'announcements' 
                ? 'bg-indigo-100 text-indigo-700' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ChatBubbleLeftIcon className="h-5 w-5 inline mr-2" />
            Announcements
          </button>
        </div>

        {/* Chat/Message Area */}
        <div className="h-96 bg-gray-50 rounded-lg p-4 mb-4 overflow-y-auto">
          {/* Add chat messages here */}
          <div className="text-gray-500 text-center mt-40">
            No messages yet
          </div>
        </div>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Communication; 