import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import StatCard from './shared/StatCard';
import {
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UserGroupIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';

const LeaveManagement = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('pending');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0,
  });

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [selectedStatus, selectedDepartment, leaveRequests]);

  const fetchLeaveRequests = async () => {
    try {
      const response = await axios.get('/api/leave-requests');
      setLeaveRequests(response.data);
      calculateStats(response.data);
    } catch (error) {
      toast.error('Failed to fetch leave requests');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (requests) => {
    const stats = requests.reduce((acc, curr) => {
      acc[curr.status]++;
      acc.total++;
      return acc;
    }, { pending: 0, approved: 0, rejected: 0, total: 0 });
    setStats(stats);
  };

  const filterRequests = () => {
    let filtered = leaveRequests;
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(request => request.status === selectedStatus);
    }
    if (selectedDepartment !== 'all') {
      filtered = filtered.filter(request => request.employee.department === selectedDepartment);
    }
    setFilteredRequests(filtered);
  };

  const handleStatusChange = async (requestId, status) => {
    try {
      await axios.patch(`/api/leave-requests/${requestId}`, { status });
      toast.success(`Leave request ${status}`);
      fetchLeaveRequests();
    } catch (error) {
      toast.error('Failed to update leave request');
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Pending Requests" value={stats.pending} icon={ClockIcon} color="yellow" />
        <StatCard title="Approved" value={stats.approved} icon={CheckCircleIcon} color="green" />
        <StatCard title="Rejected" value={stats.rejected} icon={XCircleIcon} color="red" />
        <StatCard title="Total Requests" value={stats.total} icon={CalendarIcon} color="blue" />
      </div>

      {/* Filters */}
      <div className="flex space-x-4">
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="rounded-lg border-gray-300"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="rounded-lg border-gray-300"
        >
          <option value="all">All Departments</option>
          {/* Add department options */}
        </select>
      </div>

      {/* Leave Requests List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employee
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Leave Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRequests.map((request) => (
              <LeaveRequestRow
                key={request._id}
                request={request}
                onStatusChange={handleStatusChange}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const LeaveRequestRow = ({ request, onStatusChange }) => (
  <tr>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        <div className="flex-shrink-0 h-10 w-10">
          <img
            className="h-10 w-10 rounded-full"
            src={request.employee.avatar || '/default-avatar.png'}
            alt=""
          />
        </div>
        <div className="ml-4">
          <div className="text-sm font-medium text-gray-900">
            {request.employee.name}
          </div>
          <div className="text-sm text-gray-500">
            {request.employee.department}
          </div>
        </div>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <span className="text-sm text-gray-900">{request.leaveType}</span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm text-gray-900">
        {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
      </div>
      <div className="text-sm text-gray-500">
        {request.duration} days
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
        ${request.status === 'approved' ? 'bg-green-100 text-green-800' :
          request.status === 'rejected' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'}`}>
        {request.status}
      </span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
      {request.status === 'pending' && (
        <div className="flex space-x-2">
          <button
            onClick={() => onStatusChange(request._id, 'approved')}
            className="text-green-600 hover:text-green-900"
          >
            Approve
          </button>
          <button
            onClick={() => onStatusChange(request._id, 'rejected')}
            className="text-red-600 hover:text-red-900"
          >
            Reject
          </button>
        </div>
      )}
    </td>
  </tr>
);

export default LeaveManagement; 