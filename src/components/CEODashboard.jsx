import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  UsersIcon,
  DocumentTextIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import DashboardOverview from './dashboard/DashboardOverview';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const CeoDashboard = () => {
  const [data, setData] = useState({
    totalRevenue: 0,
    netProfit: 0,
    customerSatisfaction: 0,
    employeeSatisfaction: 0,
    totalEmployees: 0,
    salesGrowth: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        toast.error('Authentication required');
        navigate('/login');
        return;
      }

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      const response = await axios.get(`${API_URL}/api/ceo/dashboard`, config);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        toast.error(`Error: ${error.response.data.message || 'Failed to load dashboard data'}`);
      } else {
        toast.error('Network error or server is down');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    toast.success('Successfully logged out');
    navigate('/login');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 bg-white shadow-lg">
          <div className="flex items-center justify-center h-16 border-b border-gray-200">
            <img src="/logo.png" alt="Company Logo" className="h-8" />
          </div>
          <nav className="flex-1 overflow-y-auto">
            <div className="px-3 py-4 space-y-1">
              {sidebarNavigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => setActiveSection(item.section)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium ${
                    activeSection === item.section
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </div>
                  {item.badge && (
                    <span className="bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full text-xs">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
            
            
          </nav>
          {/* <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center text-gray-700 hover:text-gray-900"
            >
              <ArrowRightOnRectangleIcon className="h-6 w-6" />
              <span className="ml-2">Logout</span>
            </button>
          </div> */}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm">
          <div className="flex justify-between items-center px-6 py-4">
            <h1 className="text-2xl font-semibold text-gray-900">
              {sidebarNavigation.find(item => item.section === activeSection)?.name}
            </h1>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <BellIcon className="h-6 w-6" />
              </button>
              <button
              onClick={handleLogout}
              className="flex items-center text-gray-700 hover:text-gray-900"
            >
              <ArrowRightOnRectangleIcon className="h-6 w-6" />
              <span className="ml-2">Logout</span>
            </button>
            </div>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <main className="p-6">
          {activeSection === 'dashboard' && (
            <DashboardOverview data={data} />
          )}
          {/* Add other sections based on activeSection */}
        </main>
      </div>
    </div>
  );
};

// Sidebar Navigation Items
const sidebarNavigation = [
  { name: 'Dashboard', icon: ChartBarIcon, section: 'dashboard', badge: null },
  { name: 'Financial Overview', icon: CurrencyDollarIcon, section: 'financial', badge: null },
  { name: 'Employee Overview', icon: UsersIcon, section: 'employees', badge: null },
  { name: 'Reports', icon: DocumentTextIcon, section: 'reports', badge: null },
  // Add more sections as needed
];

// Stat Card Component
const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className={`bg-white rounded-lg shadow p-6`}>
    <div className="flex items-center">
      <div className={`p-3 rounded-lg bg-${color}-100 text-${color}-600`}>
        <Icon className="h-6 w-6" />
      </div>
      <div className="ml-4">
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-semibold">{value}</p>
      </div>
    </div>
  </div>
);

export default CeoDashboard; 