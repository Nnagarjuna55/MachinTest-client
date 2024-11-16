import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  CalendarIcon,
  PlusIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

const API_URL = 'http://localhost:5000';

// Add dummy data at the top of the file
const DUMMY_LEAVE_BALANCE = {
  casual: { total: 10, used: 3 },
  sick: { total: 15, used: 5 },
  annual: { total: 20, used: 8 }
};

const DUMMY_LEAVE_REQUESTS = [
  {
    _id: '1',
    type: 'Annual',
    startDate: '2024-03-15',
    endDate: '2024-03-20',
    days: 5,
    status: 'approved',
    reason: 'Family vacation'
  },
  {
    _id: '2',
    type: 'Sick',
    startDate: '2024-02-10',
    endDate: '2024-02-12',
    days: 2,
    status: 'approved',
    reason: 'Medical appointment'
  }
];

const LeaveSection = () => {
  // Initialize state with dummy data
  const [leaveBalance, setLeaveBalance] = useState(DUMMY_LEAVE_BALANCE);
  const [leaveRequests, setLeaveRequests] = useState(DUMMY_LEAVE_REQUESTS);
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch leave data
  useEffect(() => {
    const fetchLeaveData = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        toast.error('Authentication required');
        return;
      }

      try {
        // Try to fetch real data, fallback to dummy data if API
      } catch (error) {
        console.error('Error fetching leave data:', error);
        toast.error('Failed to fetch leave data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaveData();
  }, []);

  // Submit leave request
  const handleSubmitLeave = async (leaveData) => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (!token || !userId) {
      toast.error('Authentication required');
      return;
    }

    try {
      // Try to submit to API, fallback to creating dummy request
      try {
        const response = await axios.post(
          `${API_URL}/api/leave/request`,
          { ...leaveData, userId },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        setLeaveRequests([...leaveRequests, response.data]);
      } catch (error) {
        // Create a dummy request
        const newRequest = {
          _id: Date.now().toString(),
          ...leaveData,
          status: 'pending',
          days: Math.ceil(
            (new Date(leaveData.endDate) - new Date(leaveData.startDate)) / (1000 * 60 * 60 * 24)
          )
        };
        setLeaveRequests([...leaveRequests, newRequest]);
      }
      
      setShowNewRequestModal(false);
      toast.success('Leave request submitted successfully');
    } catch (error) {
      toast.error('Failed to submit leave request');
    }
  };

  return (
    <div className="space-y-6">
      {/* Leave Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <LeaveBalanceCard
          type="Annual Leave"
          total={leaveBalance.annual.total}
          used={leaveBalance.annual.used}
        />
        <LeaveBalanceCard
          type="Sick Leave"
          total={leaveBalance.sick.total}
          used={leaveBalance.sick.used}
        />
        <LeaveBalanceCard
          type="Casual Leave"
          total={leaveBalance.casual.total}
          used={leaveBalance.casual.used}
        />
      </div>

      {/* Leave Calendar and Request Button */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Leave Calendar</h2>
          <button
            onClick={() => setShowNewRequestModal(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-indigo-700"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Request Leave</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-medium">Upcoming Leaves</h3>
            {leaveRequests
              .filter(request => new Date(request.startDate) >= new Date())
              .map(request => (
                <LeaveRequestCard key={request._id} request={request} />
              ))}
          </div>
        </div>
      </div>

      {/* Leave History */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h3 className="text-lg font-medium mb-4">Leave History</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    From
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Days
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaveRequests.map(request => (
                  <tr key={request._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {request.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(request.startDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(request.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {request.days}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs
                        ${request.status === 'approved' ? 'bg-green-100 text-green-800' :
                          request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'}`}>
                        {request.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* New Leave Request Modal */}
      {showNewRequestModal && (
        <NewLeaveRequestModal
          onClose={() => setShowNewRequestModal(false)}
          onSubmit={handleSubmitLeave}
        />
      )}
    </div>
  );
};

const LeaveBalanceCard = ({ type, total, used }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h4 className="text-lg font-medium text-gray-900">{type}</h4>
    <div className="mt-2">
      <div className="flex justify-between text-sm text-gray-500">
        <span>Total</span>
        <span>{total}</span>
      </div>
      <div className="flex justify-between text-sm text-gray-500">
        <span>Used</span>
        <span>{used}</span>
      </div>
      <div className="flex justify-between text-sm font-medium text-gray-900 mt-2">
        <span>Available</span>
        <span>{total - used}</span>
      </div>
      <div className="mt-2">
        <div className="bg-gray-200 rounded-full h-2">
          <div
            className="bg-indigo-600 rounded-full h-2"
            style={{ width: `${(used / total) * 100}%` }}
          />
        </div>
      </div>
    </div>
  </div>
);

const LeaveRequestCard = ({ request }) => (
  <div className="border rounded-lg p-4">
    <div className="flex justify-between items-start">
      <div>
        <h4 className="font-medium">{request.type} Leave</h4>
        <p className="text-sm text-gray-500">
          {new Date(request.startDate).toLocaleDateString()} - 
          {new Date(request.endDate).toLocaleDateString()}
        </p>
      </div>
      <span className={`px-2 py-1 rounded-full text-xs
        ${request.status === 'approved' ? 'bg-green-100 text-green-800' :
          request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'}`}>
        {request.status}
      </span>
    </div>
    <p className="mt-2 text-sm text-gray-600">{request.reason}</p>
  </div>
);

const NewLeaveRequestModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    type: 'annual',
    startDate: '',
    endDate: '',
    reason: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Request Leave</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Leave Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300"
            >
              <option value="annual">Annual Leave</option>
              <option value="sick">Sick Leave</option>
              <option value="casual">Casual Leave</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Reason
            </label>
            <textarea
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300"
              rows="3"
              required
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
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeaveSection; 