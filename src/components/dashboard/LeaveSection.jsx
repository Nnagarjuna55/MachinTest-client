import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import LeaveModal from './LeaveModal'; // Ensure this is imported correctly

const API_URL = 'http://localhost:5000';

const LeaveSection = () => {
  const [leaveBalance, setLeaveBalance] = useState({});
  const [leaveRequests, setLeaveRequests] = useState([]);
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
        const response = await axios.get(`${API_URL}/api/leaves/employee/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setLeaveRequests(response.data);
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
      const response = await axios.post(
        `${API_URL}/api/leaves/request`,
        { ...leaveData },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setLeaveRequests([...leaveRequests, response.data]);
      setShowNewRequestModal(false);
      toast.success('Leave request submitted successfully');
    } catch (error) {
      toast.error('Failed to submit leave request');
    }
  };

  return (
    <div>
      {/* Leave Requests List */}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {leaveRequests.map(request => (
            <div key={request._id}>
              <p>{request.type} Leave: {request.startDate} to {request.endDate}</p>
              <p>Status: {request.status}</p>
            </div>
          ))}
        </div>
      )}

      {/* New Leave Request Modal */}
      {showNewRequestModal && (
        <LeaveModal
          show={showNewRequestModal}
          onClose={() => setShowNewRequestModal(false)}
          onSubmit={handleSubmitLeave}
        />
      )}
    </div>
  );
};

export default LeaveSection; 