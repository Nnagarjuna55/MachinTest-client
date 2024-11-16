import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  UserGroupIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  UserPlusIcon,
  ChartBarIcon,
  CalendarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  CogIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Navigation configuration
const navigation = [
  { name: 'Dashboard', icon: ChartBarIcon, href: '/hr/dashboard', section: 'dashboard' },
  { name: 'Employees', icon: UserGroupIcon, href: '/hr/employees', section: 'employees' },
  { name: 'Recruitment', icon: UserPlusIcon, href: '/hr/recruitment', section: 'recruitment' },
  { name: 'Attendance', icon: ClockIcon, href: '/hr/attendance', section: 'attendance' },
  { name: 'Leave Management', icon: CalendarIcon, href: '/hr/leave', section: 'leave' },
  { name: 'Payroll', icon: CurrencyDollarIcon, href: '/hr/payroll', section: 'payroll' },
  { name: 'Training', icon: BriefcaseIcon, href: '/hr/training', section: 'training' },
  { name: 'Documents', icon: DocumentTextIcon, href: '/hr/documents', section: 'documents' },
  { name: 'Reports', icon: ChartBarIcon, href: '/hr/reports', section: 'reports' },
  { name: 'Settings', icon: CogIcon, href: '/hr/settings', section: 'settings' },
];

export default function HRDashboard() {
  // State management
  const [activeSection, setActiveSection] = useState('dashboard');
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    departments: [],
    recentHires: [],
    pendingLeaveRequests: 0,
    upcomingTrainings: 0,
    openPositions: 0,
    todayAttendance: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchHRData();
  }, []);

  const fetchHRData = async () => {
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

      // Fetch all required HR data
      const responses = await Promise.allSettled([
        axios.get(`${API_URL}/api/hr/stats`, config),
        axios.get(`${API_URL}/api/hr/employees`, config),
        axios.get(`${API_URL}/api/hr/leave-requests`, config),
        axios.get(`${API_URL}/api/hr/attendance`, config),
        axios.get(`${API_URL}/api/hr/trainings`, config),
      ]);

      responses.forEach((response, index) => {
        if (response.status === 'fulfilled') {
          // Handle successful responses
          if (index === 0) setStats(response.value.data); // Assuming the first response is stats
        } else {
          console.error(`API call ${index} failed:`, response.reason);
          toast.error('Failed to load HR data');
        }
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load HR data');
      toast.error('Failed to load HR data');
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
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="bg-red-50 p-6 rounded-lg shadow-sm">
          <h3 className="text-red-800 font-medium mb-2">Error Loading Dashboard</h3>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="mt-4 px-4 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 bg-white shadow-lg">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                    activeSection === item.section
                      ? 'bg-indigo-100 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                  onClick={() => setActiveSection(item.section)}
                >
                  <item.icon className="mr-3 h-6 w-6" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm">
          <div className="flex justify-between items-center px-6 py-4">
            <h1 className="text-2xl font-semibold text-gray-900">
              {navigation.find(item => item.section === activeSection)?.name}
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

        {/* Dashboard Content */}
        <div className="p-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Employees"
              value={stats.totalEmployees}
              icon={UserGroupIcon}
              color="indigo"
            />
            <StatCard
              title="Today's Attendance"
              value={`${stats.todayAttendance}/${stats.activeEmployees}`}
              icon={ClockIcon}
              color="green"
            />
            <StatCard
              title="Pending Leaves"
              value={stats.pendingLeaveRequests}
              icon={CalendarIcon}
              color="yellow"
            />
            <StatCard
              title="Open Positions"
              value={stats.openPositions}
              icon={BriefcaseIcon}
              color="red"
            />
          </div>

          {/* Department Distribution */}
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium mb-4">Department Distribution</h3>
              <div className="space-y-4">
                {stats.departments.map((dept) => (
                  <div key={dept.name} className="flex items-center justify-between">
                    <span className="text-gray-600">{dept.name}</span>
                    <span className="font-medium">{dept.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Hires */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium mb-4">Recent Hires</h3>
              <div className="space-y-4">
                {stats.recentHires.map((hire) => (
                  <div key={hire.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{hire.name}</p>
                      <p className="text-sm text-gray-500">{hire.position}</p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(hire.date).toLocaleDateString()}
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

// Stat Card Component
const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white rounded-lg shadow p-6">
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