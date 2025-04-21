import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  UserGroupIcon,
  UserIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  PlusCircleIcon,
  MagnifyingGlassIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';
import { useNavigate, Link } from 'react-router-dom';

export default function Dashboard() {
  const [counts, setCounts] = useState({
    total: 0,
    male: 0,
    female: 0,
    byDesignation: [],
    byCourse: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get('http://localhost:5000/api/employees/count', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data) {
        setCounts(response.data);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError('Failed to load dashboard data');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <img
                src="/NSTechno.png"
                alt="Company Logo"
                className="h-10 w-auto"
              />
              <span className="ml-3 text-xl font-bold text-gray-800">
                NS TECHNO.
              </span>
            </div>

            <div className="flex items-center space-x-6">
              <div className="hidden md:flex space-x-4">
                <Link
                  to="/admin/create-employee"
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                >
                  <PlusCircleIcon className="h-5 w-5 mr-1" />
                  Create Employee
                </Link>
                <Link
                  to="/admin/employee-list"
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                >
                  <ClipboardDocumentListIcon className="h-5 w-5 mr-1" />
                  Employee List
                </Link>
                <Link
                  to="/admin/search-employee"
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                >
                  <MagnifyingGlassIcon className="h-5 w-5 mr-1" />
                  Search
                </Link>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center">
                  <img
                    src="/NSTechno.png"
                    alt="Admin"
                    className="h-8 w-8 rounded-full"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">Admin</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5 mr-1" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Welcome Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome to Admin Dashboard
                </h1>
                <p className="mt-2 text-gray-600">
                  Manage your employees and monitor organization statistics
                </p>
              </div>
              <div className="hidden sm:block">
                <img
                  src="/NSTechno.png"
                  alt="Welcome"
                  className="h-24 w-auto"
                />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Link
                to="/admin/create-employee"
                className="flex items-center p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors duration-200"
              >
                <PlusCircleIcon className="h-8 w-8 text-indigo-600" />
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-indigo-900">Create Employee</h3>
                  <p className="text-sm text-indigo-700">Add new team members</p>
                </div>
              </Link>

              <Link
                to="/admin/employee-list"
                className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200"
              >
                <ClipboardDocumentListIcon className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-green-900">Employee List</h3>
                  <p className="text-sm text-green-700">View all employees</p>
                </div>
              </Link>

              <Link
                to="/admin/search-employee"
                className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
              >
                <MagnifyingGlassIcon className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-blue-900">Search Employee</h3>
                  <p className="text-sm text-blue-700">Find specific employees</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Organization Statistics
        </h2>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Employees */}
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
                      {counts.total}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Male Employees */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UserIcon className="h-6 w-6 text-blue-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Male Employees
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {counts.male}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Female Employees */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UserIcon className="h-6 w-6 text-pink-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Female Employees
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {counts.female}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Statistics */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Designation Distribution */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Employees by Designation
              </h3>
              <div className="space-y-4">
                {counts.byDesignation.map(({ _id, count }) => (
                  <div key={_id} className="flex items-center">
                    <BriefcaseIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="flex-1 text-sm text-gray-600">{_id}</span>
                    <span className="text-sm font-medium text-gray-900">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Course Distribution */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Employees by Course
              </h3>
              <div className="space-y-4">
                {counts.byCourse.map(({ _id, count }) => (
                  <div key={_id} className="flex items-center">
                    <AcademicCapIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="flex-1 text-sm text-gray-600">{_id}</span>
                    <span className="text-sm font-medium text-gray-900">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
