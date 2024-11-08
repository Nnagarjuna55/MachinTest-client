import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  UserGroupIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  UserPlusIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function HRDashboard() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    departments: [],
    recentHires: []
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHRStats();
  }, []);

  const fetchHRStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/employees/hr-stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      toast.error('Failed to fetch HR statistics');
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
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">HR Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/hr/create-employee"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                <UserPlusIcon className="h-5 w-5 inline-block mr-2" />
                Add Employee
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* Total Employees Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UserGroupIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Employees
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.totalEmployees}
                    </dd>
                  </dl>
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
                  to="/hr/employee-list"
                  className="flex items-center text-indigo-600 hover:text-indigo-800"
                >
                  <ClipboardDocumentListIcon className="h-5 w-5 mr-2" />
                  View Employee List
                </Link>
                <Link
                  to="/hr/documents"
                  className="flex items-center text-indigo-600 hover:text-indigo-800"
                >
                  <DocumentTextIcon className="h-5 w-5 mr-2" />
                  Manage Documents
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 