import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const EmployeeDashboard = () => {
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployeeData();
  }, []);

  const fetchEmployeeData = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        navigate('/login');
        return;
      }

      // Set default authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Fetch employee data
      const response = await axios.get(`${API_URL}/api/employees/${userId}`);
      
      if (response.data) {
        setEmployeeData(response.data);
        setError(null);
      }
    } catch (error) {
      console.error('Error fetching employee data:', error);
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate('/login');
      } else {
        setError('Failed to load employee data');
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
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-2xl font-bold text-indigo-600">Employee Portal</h1>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className="flex items-center">
                  {employeeData?.image ? (
                    <img
                      src={`${API_URL}/uploads/${employeeData.image}`}
                      alt={employeeData.name}
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <UserCircleIcon className="h-8 w-8 text-gray-400" />
                  )}
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    {employeeData?.name}
                  </span>
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Profile Card */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {employeeData?.image ? (
                  <img
                    src={`${API_URL}/uploads/${employeeData.image}`}
                    alt={employeeData.name}
                    className="h-24 w-24 rounded-full"
                  />
                ) : (
                  <UserCircleIcon className="h-24 w-24 text-gray-400" />
                )}
              </div>
              <div className="ml-5">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {employeeData?.name}
                </h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500">
                  <p>{employeeData?.designation}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* Contact Information */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <EnvelopeIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5">
                  <h4 className="text-sm font-medium text-gray-500">Email</h4>
                  <p className="mt-1 text-sm text-gray-900">{employeeData?.email}</p>
                </div>
              </div>
              <div className="mt-5 flex items-center">
                <div className="flex-shrink-0">
                  <PhoneIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5">
                  <h4 className="text-sm font-medium text-gray-500">Mobile</h4>
                  <p className="mt-1 text-sm text-gray-900">{employeeData?.mobile}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Designation */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BriefcaseIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5">
                  <h4 className="text-sm font-medium text-gray-500">Designation</h4>
                  <p className="mt-1 text-sm text-gray-900">{employeeData?.designation}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Courses */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AcademicCapIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5">
                  <h4 className="text-sm font-medium text-gray-500">Courses</h4>
                  <div className="mt-1">
                    {employeeData?.courses.map((course, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 mr-2 mb-2"
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard; 