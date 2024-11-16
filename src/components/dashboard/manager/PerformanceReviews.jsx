import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  ChartBarIcon,
  StarIcon,
  PlusIcon,
  UserGroupIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from '@heroicons/react/24/outline';
import { Line } from 'react-chartjs-2';
import StatCard from './shared/StatCard';
import { API_URL } from '../../../config/config';

const PerformanceReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showAddReview, setShowAddReview] = useState(false);
  const [performanceMetrics, setPerformanceMetrics] = useState({
    topPerformers: [],
    needsImprovement: [],
    averageRating: 0,
  });

  useEffect(() => {
    fetchPerformanceData();
  }, []);

  const fetchPerformanceData = async () => {
    try {
      const [reviewsRes, employeesRes] = await Promise.all([
        axios.get(`${API_URL}/api/performance-reviews`),
        axios.get(`${API_URL}/api/employees`)
      ]);
      setReviews(reviewsRes.data);
      setEmployees(employeesRes.data);
      calculateMetrics(reviewsRes.data);
    } catch (error) {
      toast.error('Failed to fetch performance data');
    }
  };

  const calculateMetrics = (reviewsData) => {
    // Calculate average rating and identify top/bottom performers
    const metrics = {
      topPerformers: [],
      needsImprovement: [],
      averageRating: 0,
    };
    // Implementation of metrics calculation
    setPerformanceMetrics(metrics);
  };

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Average Performance"
          value={`${performanceMetrics.averageRating.toFixed(1)}/5`}
          icon={ChartBarIcon}
          color="blue"
        />
        <StatCard
          title="Top Performers"
          value={performanceMetrics.topPerformers.length}
          icon={ArrowUpIcon}
          color="green"
        />
        <StatCard
          title="Needs Improvement"
          value={performanceMetrics.needsImprovement.length}
          icon={ArrowDownIcon}
          color="red"
        />
      </div>

      {/* Performance Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4">Performance Trends</h3>
        <div className="h-64">
          <Line
            data={{
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
              datasets: [{
                label: 'Average Performance Score',
                data: [4.2, 4.3, 4.1, 4.4, 4.2, 4.5],
                borderColor: 'rgb(79, 70, 229)',
                tension: 0.4,
              }]
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
            }}
          />
        </div>
      </div>

      {/* Recent Reviews */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Recent Performance Reviews</h3>
            <button
              onClick={() => setShowAddReview(true)}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              New Review
            </button>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {reviews.map((review) => (
            <ReviewCard key={review._id} review={review} />
          ))}
        </div>
      </div>

      {/* Add Review Modal */}
      {showAddReview && (
        <AddReviewModal
          employees={employees}
          onClose={() => setShowAddReview(false)}
          onSubmit={fetchPerformanceData}
        />
      )}
    </div>
  );
};

const ReviewCard = ({ review }) => (
  <div className="p-6 hover:bg-gray-50">
    <div className="flex justify-between items-start">
      <div className="flex items-center">
        <img
          src={review.employee.avatar || '/default-avatar.png'}
          alt=""
          className="h-12 w-12 rounded-full"
        />
        <div className="ml-4">
          <h4 className="text-lg font-medium">{review.employee.name}</h4>
          <p className="text-sm text-gray-500">{review.employee.position}</p>
        </div>
      </div>
      <div className="flex items-center">
        {[...Array(5)].map((_, index) => (
          <StarIcon
            key={index}
            className={`h-5 w-5 ${
              index < review.rating
                ? 'text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
    <div className="mt-4">
      <h5 className="text-sm font-medium">Performance Summary</h5>
      <p className="mt-1 text-sm text-gray-600">{review.summary}</p>
    </div>
    <div className="mt-4 grid grid-cols-2 gap-4">
      <div>
        <h5 className="text-sm font-medium">Strengths</h5>
        <ul className="mt-1 text-sm text-gray-600">
          {review.strengths.map((strength, index) => (
            <li key={index}>{strength}</li>
          ))}
        </ul>
      </div>
      <div>
        <h5 className="text-sm font-medium">Areas for Improvement</h5>
        <ul className="mt-1 text-sm text-gray-600">
          {review.improvements.map((improvement, index) => (
            <li key={index}>{improvement}</li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

const AddReviewModal = ({ show, onClose, onSubmit }) => {
  // Modal implementation
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      {/* Modal content */}
    </div>
  );
};

export default PerformanceReviews; 