import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  ChartPieIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function CEODashboard() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    departments: [],
    performance: {},
    growth: {}
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCEOStats();
  }, []);

  const fetchCEOStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/employees/ceo-stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      toast.error('Failed to fetch CEO statistics');
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">CEO Dashboard</h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-gray-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Company Overview */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <UserGroupIcon className="h-6 w-6 text-gray-400" />
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">Total Workforce</h3>
                  <p className="text-2xl font-semibold text-indigo-600">{stats.totalEmployees}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Department Performance */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <ChartPieIcon className="h-6 w-6 text-gray-400" />
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">Departments</h3>
                  <p className="text-2xl font-semibold text-indigo-600">
                    {stats.departments.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Growth Metrics */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <h3 className="text-lg font-medium text-gray-900">Company Growth</h3>
              <div className="mt-4">
                <div className="flex items-center">
                  <ArrowTrendingUpIcon className="h-5 w-5 text-green-500" />
                  <span className="ml-2 text-sm text-gray-500">Year over Year</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 