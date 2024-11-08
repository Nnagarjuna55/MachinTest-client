import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  ChartBarIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function ManagerDashboard() {
  const [stats, setStats] = useState({
    teamMembers: 0,
    projects: [],
    performance: {}
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchManagerStats();
  }, []);

  const fetchManagerStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/employees/manager-stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      toast.error('Failed to fetch manager statistics');
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
              <h1 className="text-xl font-bold">Manager Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/manager/team"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                View Team
              </Link>
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
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* Team Members Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <UserGroupIcon className="h-6 w-6 text-gray-400" />
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">Team Members</h3>
                  <p className="text-2xl font-semibold text-indigo-600">{stats.teamMembers}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
              <div className="mt-4 space-y-2">
                <Link
                  to="/manager/performance"
                  className="flex items-center text-indigo-600 hover:text-indigo-800"
                >
                  <ChartBarIcon className="h-5 w-5 mr-2" />
                  Performance Reviews
                </Link>
                <Link
                  to="/manager/schedule"
                  className="flex items-center text-indigo-600 hover:text-indigo-800"
                >
                  <CalendarIcon className="h-5 w-5 mr-2" />
                  Team Schedule
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 