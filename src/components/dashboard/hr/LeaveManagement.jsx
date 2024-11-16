import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

// LeaveRequestRow Component
const LeaveRequestRow = ({ request, onApprove, onReject }) => (
  <tr>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm font-medium text-gray-900">{request.employeeName}</div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm text-gray-900">{request.type}</div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm text-gray-900">
        {new Date(request.startDate).toLocaleDateString()}
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm text-gray-900">
        {new Date(request.endDate).toLocaleDateString()}
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
        request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
        request.status === 'approved' ? 'bg-green-100 text-green-800' :
        'bg-red-100 text-red-800'
      }`}>
        {request.status}
      </span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
      {request.status === 'pending' && (
        <>
          <button
            onClick={() => onApprove(request.id)}
            className="text-green-600 hover:text-green-900 mr-4"
          >
            <CheckIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => onReject(request.id)}
            className="text-red-600 hover:text-red-900"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </>
      )}
    </td>
  </tr>
);

const LeaveManagement = () => {
  // ... rest of the component remains the same ...
};

export default LeaveManagement; 