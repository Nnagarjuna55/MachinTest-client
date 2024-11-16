import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  ChartBarIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  CalendarIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  ChatBubbleLeftIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  BellIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import TeamManagement from './dashboard/manager/TeamManagement';
import ProjectsAndTasks from './dashboard/manager/ProjectsAndTasks';
import AttendanceManagement from './dashboard/manager/AttendanceManagement';
import LeaveManagement from './dashboard/manager/LeaveManagement';
import PerformanceReviews from './dashboard/manager/PerformanceReviews';
import TrainingManagement from './dashboard/manager/TrainingManagement';
import Reports from './dashboard/manager/Reports';
import PayrollManagement from './dashboard/manager/PayrollManagement';
import Communication from './dashboard/manager/Communication';
import CompanyInfo from './dashboard/manager/CompanyInfo';
import Settings from './dashboard/manager/Settings';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Add error handling utility
const handleApiError = (error, message) => {
  console.error(message, error);
  if (error.response?.data?.message) {
    toast.error(error.response.data.message);
  } else {
    toast.error(message);
  }
  return null;
};

export default function ManagerDashboard() {
  const navigate = useNavigate();
  
  // All state declarations
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [employeeData, setEmployeeData] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [departmentStats, setDepartmentStats] = useState({});
  const [attendance, setAttendance] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState({
    leaves: [],
    expenses: [],
    timeoffs: [],
    documents: []
  });
  const [teamPerformance, setTeamPerformance] = useState({
    overview: { averageRating: 0 },
    metrics: [],
    trends: []
  });
  const [stats, setStats] = useState({
    teamMembers: [],
    projects: [],
    leaveRequests: [],
    departmentStats: {
      budget: 0
    }
  });

  // Sidebar Navigation Items
  const sidebarNavigation = [
    { 
      name: 'Dashboard',
      icon: ChartBarIcon, 
      section: 'dashboard',
      badge: null 
    },
    { 
      name: 'Team Management', 
      icon: UserGroupIcon, 
      section: 'team',
      badge: teamMembers?.length || null
    },
    { 
      name: 'Projects & Tasks', 
      icon: BriefcaseIcon, 
      section: 'projects',
      badge: tasks?.filter(t => t.status === 'pending').length || null
    },
    { 
      name: 'Attendance', 
      icon: CalendarIcon, 
      section: 'attendance',
      badge: null 
    },
    { 
      name: 'Leave Management', 
      icon: ClipboardDocumentListIcon, 
      section: 'leave',
      badge: leaveRequests?.filter(l => l.status === 'pending').length || null
    },
    { 
      name: 'Performance Reviews', 
      icon: ChartBarIcon, 
      section: 'performance',
      badge: null 
    },
    { 
      name: 'Training Management', 
      icon: AcademicCapIcon, 
      section: 'training',
      badge: null 
    },
    { 
      name: 'Reports', 
      icon: DocumentTextIcon, 
      section: 'reports',
      badge: null 
    },
    { 
      name: 'Payroll', 
      icon: CurrencyDollarIcon, 
      section: 'payroll',
      badge: null 
    },
    { 
      name: 'Communication', 
      icon: ChatBubbleLeftIcon, 
      section: 'communication',
      badge: null 
    },
    { 
      name: 'Company', 
      icon: BuildingOfficeIcon, 
      section: 'company',
      badge: null 
    },
    { 
      name: 'Settings', 
      icon: CogIcon, 
      section: 'settings',
      badge: null 
    }
  ];

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check authentication
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if (!token || !userId) {
          toast.error('Please login to continue');
          navigate('/login');
          return;
        }

        // Set axios defaults
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Fetch data with proper error handling
        const responses = await Promise.allSettled([
          axios.get(`${API_URL}/api/employees/${userId}`),
          axios.get(`${API_URL}/api/employees/manager-stats`),
          axios.get(`${API_URL}/api/leave/manager`),
          axios.get(`${API_URL}/api/performance/manager`),
          axios.get(`${API_URL}/api/department/stats`)
        ]);

        responses.forEach((response, index) => {
          if (response.status === 'rejected') {
            console.error(`API call ${index} failed:`, response.reason);
          }
        });

        // Process responses with default values
        const [
          employeeResponse,
          teamResponse,
          leaveResponse,
          performanceResponse,
          departmentResponse
        ] = responses;

        // Update states with data or defaults
        setEmployeeData(employeeResponse.status === 'fulfilled' ? employeeResponse.value.data : null);
        
        setTeamMembers(
          teamResponse.status === 'fulfilled' ? teamResponse.value.data?.teamMembers || [] : []
        );
        
        setLeaveRequests(
          leaveResponse.status === 'fulfilled' ? leaveResponse.value.data || [] : []
        );
        
        setTeamPerformance(
          performanceResponse.status === 'fulfilled' 
            ? performanceResponse.value.data 
            : { overview: { averageRating: 0 }, metrics: [], trends: [] }
        );
        
        setDepartmentStats(
          departmentResponse.status === 'fulfilled' ? departmentResponse.value.data : { budget: 0 }
        );

        // Update stats state
        setStats({
          teamMembers: teamResponse.status === 'fulfilled' ? teamResponse.value.data?.teamMembers || [] : [],
          projects: [],
          leaveRequests: leaveResponse.status === 'fulfilled' ? leaveResponse.value.data || [] : [],
          departmentStats: departmentResponse.status === 'fulfilled' ? departmentResponse.value.data : { budget: 0 }
        });

        // Update pending approvals
        setPendingApprovals({
          leaves: leaveResponse.status === 'fulfilled' 
            ? leaveResponse.value.data?.filter(l => l.status === 'pending') || []
            : [],
          expenses: [],
          timeoffs: [],
          documents: []
        });

      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load manager data');
        toast.error('Failed to load manager data');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
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
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-gray-800">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <img
                  className="h-8 w-auto"
                  src="/logo.png"
                  alt="Company Logo"
                />
              </div>
              <nav className="mt-5 flex-1 px-2 space-y-1">
                {sidebarNavigation.map((item) => (
                  <button
                    key={item.section}
                    onClick={() => setActiveSection(item.section)}
                    className={`${
                      activeSection === item.section
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    } group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full`}
                  >
                    <item.icon className="mr-3 h-6 w-6" />
                    {item.name}
                    {item.badge && (
                      <span className="ml-auto bg-gray-900 text-gray-300 py-0.5 px-2 rounded-full text-xs">
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
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
            <ManagerDashboardOverview 
              stats={stats} 
              teamPerformance={teamPerformance} 
              pendingApprovals={pendingApprovals} 
            />
          )}
          {activeSection === 'team' && (
            <TeamManagement 
              teamMembers={teamMembers}
              departmentStats={departmentStats}
            />
          )}
          {activeSection === 'projects' && (
            <ProjectsAndTasks 
              tasks={tasks}
              teamMembers={teamMembers}
            />
          )}
          {activeSection === 'attendance' && (
            <AttendanceManagement 
              attendance={attendance}
              teamMembers={teamMembers}
            />
          )}
          {activeSection === 'leave' && (
            <LeaveManagement 
              leaveRequests={leaveRequests}
              teamMembers={teamMembers}
            />
          )}
          {activeSection === 'performance' && (
            <PerformanceReviews 
              teamMembers={teamMembers}
              teamPerformance={teamPerformance}
            />
          )}
          {activeSection === 'training' && (
            <TrainingManagement 
              teamMembers={teamMembers}
            />
          )}
          {activeSection === 'reports' && (
            <Reports 
              stats={stats}
              teamMembers={teamMembers}
              attendance={attendance}
              performance={teamPerformance}
            />
          )}
          {activeSection === 'payroll' && (
            <PayrollManagement 
              teamMembers={teamMembers}
              departmentStats={departmentStats}
            />
          )}
          {activeSection === 'communication' && (
            <Communication 
              teamMembers={teamMembers}
            />
          )}
          {activeSection === 'company' && (
            <CompanyInfo />
          )}
          {activeSection === 'settings' && (
            <Settings />
          )}
        </main>
      </div>
    </div>
  );
}

// Add these components at the end of the file
const PendingApprovalsCard = ({ approvals }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium mb-4">Pending Approvals</h3>
      <div className="space-y-4">
        {Object.entries(approvals).map(([type, items]) => (
          <div key={type}>
            <h4 className="text-sm font-medium text-gray-500 capitalize">{type}</h4>
            <p className="text-2xl font-semibold">{items.length}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const TeamPerformanceCard = ({ performance }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium mb-4">Team Performance</h3>
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-500">Average Rating</h4>
          <p className="text-2xl font-semibold">
            {performance.overview?.averageRating || 0}%
          </p>
        </div>
      </div>
    </div>
  );
};

// Add the ManagerDashboardOverview component
const ManagerDashboardOverview = ({ stats, teamPerformance, pendingApprovals }) => {
  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Team Members"
          value={stats.teamMembers?.length || 0}
          icon={UserGroupIcon}
          color="blue"
        />
        <StatCard
          title="Active Projects"
          value={stats.projects?.length || 0}
          icon={BriefcaseIcon}
          color="green"
        />
        <StatCard
          title="Pending Requests"
          value={Object.values(pendingApprovals).flat().length}
          icon={ClockIcon}
          color="yellow"
        />
        <StatCard
          title="Department Budget"
          value={`$${stats.departmentStats?.budget?.toLocaleString() || 0}`}
          icon={CurrencyDollarIcon}
          color="indigo"
        />
      </div>

      {/* Performance and Approvals Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PendingApprovalsCard approvals={pendingApprovals} />
        <TeamPerformanceCard performance={teamPerformance} />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium">Recent Activity</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {/* Add recent activity items here */}
        </div>
      </div>
    </div>
  );
};

// Add the StatCard component
const StatCard = ({ title, value, icon: Icon, color }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg bg-${color}-100`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
};