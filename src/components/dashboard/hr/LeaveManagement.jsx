import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import LeaveSection from '../LeaveSection';
 // Ensure this is imported correctly

const LeaveManagement = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        const response = await axios.get('/api/leaves/manager');
        setLeaveRequests(response.data);
      } catch (error) {
        toast.error('Failed to fetch leave requests');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveRequests();
  }, []);

  const handleApprove = async (requestId) => {
    try {
      await axios.patch(`/api/leaves/${requestId}`, { status: 'approved' });
      toast.success('Leave request approved');
      setLeaveRequests(leaveRequests.filter(request => request._id !== requestId));
    } catch (error) {
      toast.error('Failed to approve leave request');
    }
  };

  const handleReject = async (requestId) => {
    try {
      await axios.patch(`/api/leaves/${requestId}`, { status: 'rejected' });
      toast.success('Leave request rejected');
      setLeaveRequests(leaveRequests.filter(request => request._id !== requestId));
    } catch (error) {
      toast.error('Failed to reject leave request');
    }
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Leave Type</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaveRequests.map(request => (
              <LeaveSection
                key={request._id}
                request={request}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LeaveManagement; 