import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const API_URL = 'http://localhost:3001';

const fetchAllData = async () => {
  try {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login again');
      navigate('/login');
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    const responses = await Promise.allSettled([
      axios.get(`${API_URL}/api/employees/manager-stats`, config),
      // ... other API calls
    ]);

    responses.forEach((response, index) => {
      if (response.status === 'rejected') {
        console.error(`API call ${index} failed:`, response.reason);
        // Log the full error object for debugging
        console.error('Full error object:', {
          message: response.reason.message,
          response: response.reason.response?.data,
          status: response.reason.response?.status
        });
      }
    });

    // ... rest of your code

  } catch (error) {
    console.error('Error fetching data:', error);
    setError('Failed to load dashboard data');
    toast.error('Failed to load dashboard data');
  } finally {
    setLoading(false);
  }
}; 