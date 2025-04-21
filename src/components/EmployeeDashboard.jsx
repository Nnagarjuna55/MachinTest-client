import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  CalendarIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  BookOpenIcon,
  BuildingOfficeIcon,
  UsersIcon,
  DocumentDuplicateIcon,
  CogIcon,
  BellIcon
} from '@heroicons/react/24/outline';

// Import components once
import ProfileCard from './dashboard/ProfileCard';
import DashboardOverview from './dashboard/DashboardOverview';
import ProfileSection from './dashboard/ProfileSection';
import AttendanceSection from './dashboard/AttendanceSection';
import TasksSection from './dashboard/TasksSection';
import LeaveSection from './dashboard/LeaveSection';
import TrainingSection from './dashboard/TrainingSection';
import DocumentSection from './dashboard/DocumentSection';
import PayrollSection from './dashboard/PayrollSection';
import TeamSection from './dashboard/TeamSection';
import CompanySection from './dashboard/CompanySection';
import SettingsSection from './dashboard/SettingsSection';
import LeaveModal from './dashboard/LeaveModal';
import LeaveManagement from './dashboard/hr/LeaveManagement';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Add dummy data
const DUMMY_TASKS = [
  {
    _id: '1',
    title: 'Complete Project Proposal',
    description: 'Draft and submit project proposal for client review',
    status: 'pending',
    dueDate: '2024-03-20'
  },
  {
    _id: '2',
    title: 'Weekly Team Meeting',
    description: 'Attend weekly team sync and present updates',
    status: 'completed',
    dueDate: '2024-03-15'
  }
];

const DUMMY_ATTENDANCE = [
  {
    date: new Date().toISOString(),
    clockIn: '09:00',
    clockOut: '17:00',
    status: 'present'
  }
];

const DUMMY_LEAVE_BALANCE = {
  casual: { total: 10, used: 3 },
  sick: { total: 15, used: 5 },
  annual: { total: 20, used: 8 }
};

const DUMMY_LEAVE_REQUESTS = [
  {
    _id: '1',
    type: 'annual',
    startDate: '2024-03-20',
    endDate: '2024-03-25',
    status: 'pending',
    reason: 'Family vacation'
  }
];

const DUMMY_PAYSLIPS = [
  {
    _id: '1',
    month: 'March 2024',
    basic: 5000,
    allowances: 1000,
    deductions: 500,
    netPay: 5500
  }
];

const EmployeeDashboard = () => {
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Add these new sections to EmployeeDashboard.jsx

  // New state variables
  const [attendance, setAttendance] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [payslips, setPayslips] = useState([]);

  // New state variables for features
  const [clockedIn, setClockedIn] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [leaveBalance, setLeaveBalance] = useState({
    casual: 0,
    sick: 0,
    annual: 0
  });
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  // Add new state for active section
  const [activeSection, setActiveSection] = useState('dashboard');

  // Add new state for leave management
  const [leaveManagementData, setLeaveManagementData] = useState([]);

  // Add new state for leave management
  const [showLeaveManagement, setShowLeaveManagement] = useState(false);

  // Sidebar navigation items
  const sidebarNavigation = [
    {
      name: 'Dashboard',
      icon: ChartBarIcon,
      section: 'dashboard',
      badge: null
    },
    {
      name: 'My Profile',
      icon: UserCircleIcon,
      section: 'profile',
      badge: null
    },
    {
      name: 'Attendance',
      icon: ClockIcon,
      section: 'attendance',
      badge: null
    },
    {
      name: 'Tasks & Projects',
      icon: BriefcaseIcon,
      section: 'tasks',
      badge: tasks?.filter(t => t.status === 'pending').length || null
    },
    {
      name: 'Leave Management',
      icon: CalendarIcon,
      section: 'leave',
      badge: leaveRequests?.filter(l => l.status === 'pending').length || null
    },
    {
      name: 'Training',
      icon: AcademicCapIcon,
      section: 'training',
      badge: null
    },
    {
      name: 'Documents',
      icon: DocumentDuplicateIcon,
      section: 'documents',
      badge: null
    },
    {
      name: 'Payroll',
      icon: CurrencyDollarIcon,
      section: 'payroll',
      badge: null
    },
    {
      name: 'Team',
      icon: UsersIcon,
      section: 'team',
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

  // Fetch all employee data
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if (!token || !userId) {
          toast.error('Please login again');
          navigate('/login');
          return;
        }

        const config = {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        };

        // Fetch employee data
        try {
          const employeeResponse = await axios.get(`${API_URL}/api/employees/${userId}`, config);
          setEmployeeData(employeeResponse.data);
        } catch (error) {
          console.log('Using dummy employee data');
          setEmployeeData({
            _id: userId,
            name: 'John Doe',
            email: 'john@example.com',
            department: 'Engineering',
            position: 'Software Developer'
          });
        }

        // Fetch tasks data
        try {
          const tasksResponse = await axios.get(`${API_URL}/api/tasks/employee/${userId}`, config);
          setTasks(tasksResponse.data || DUMMY_TASKS);
        } catch (error) {
          console.log('Using dummy tasks data');
          setTasks(DUMMY_TASKS);
        }

        // Fetch leave requests and balance
        try {
          const leavesResponse = await axios.get(`${API_URL}/api/leaves/employee/${userId}`, config);
          setLeaveRequests(leavesResponse.data?.requests || DUMMY_LEAVE_REQUESTS);
          setLeaveBalance(leavesResponse.data?.balance || DUMMY_LEAVE_BALANCE);
        } catch (error) {
          console.log('Leave data not available:', error.message);
          setLeaveRequests(DUMMY_LEAVE_REQUESTS);
          setLeaveBalance(DUMMY_LEAVE_BALANCE);
        }

        // Fetch attendance data
        try {
          const attendanceResponse = await axios.get(`${API_URL}/api/attendance/employee/${userId}/today`, config);
          setAttendance(attendanceResponse.data || DUMMY_ATTENDANCE);
        } catch (error) {
          console.log('Attendance data not available:', error.message);
          setAttendance(DUMMY_ATTENDANCE);
        }

        // Fetch payslips data
        try {
          const payslipsResponse = await axios.get(`${API_URL}/api/payslips/employee/${userId}`, config);
          setPayslips(payslipsResponse.data || DUMMY_PAYSLIPS);
        } catch (error) {
          console.log('Payslips data not available:', error.message);
          setPayslips(DUMMY_PAYSLIPS);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load employee data');
        toast.error('Failed to load employee data');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [navigate]);

  // Fetch leave management data
  useEffect(() => {
    const fetchLeaveManagementData = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) return;

      try {
        const response = await axios.get(`${API_URL}/api/leaves/employee/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setLeaveManagementData(response.data);
      } catch (error) {
        console.error('Error fetching leave management data:', error);
      }
    };

    fetchLeaveManagementData();
  }, []);

  // Attendance handlers
  const handleClockInOut = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/api/attendance/clock-${clockedIn ? 'out' : 'in'}`);
      // const response = await axios.post(`${API_URL}/api/attendance/clock-${clockedIn ? 'out' : 'in'}`);
      setClockedIn(!clockedIn);
      toast.success(`Successfully clocked ${clockedIn ? 'out' : 'in'}`);
    } catch (error) {
      toast.error('Failed to update attendance');
    }
  };

  // Task handlers
  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      // await axios.patch(`${API_URL}/api/tasks/${taskId}`, { status: newStatus });
      await axios.patch(`http://localhost:5000/api/tasks/${taskId}`, { status: newStatus });
      const updatedTasks = tasks.map(task =>
        task._id === taskId ? { ...task, status: newStatus } : task
      );
      setTasks(updatedTasks);
      toast.success('Task status updated');
    } catch (error) {
      toast.error('Failed to update task status');
    }
  };

  // Leave handlers
  const handleLeaveSubmit = async (leaveData) => {
    try {
      // await axios.post(`${API_URL}/api/leaves`, leaveData);
      await axios.post(`http://localhost:5000/api/leaves`, leaveData);
      const response = await axios.get(`${API_URL}/api/leaves/${employeeData._id}`);
      setLeaveRequests(response.data.requests);
      setShowLeaveModal(false);
      toast.success('Leave request submitted successfully');
    } catch (error) {
      toast.error('Failed to submit leave request');
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
      {/* Sidebar - keep as is */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-72 bg-white shadow-lg">
          {/* Company Logo */}
          <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
            <img src="/NSTechno.png" alt="Company Logo" className="h-8" />
          </div>

          {/* User Profile Quick View */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                {employeeData?.image ? (
                  <img
                    // src={employeeData.image}
                    src={`http://localhost:5000/api/uploads/${employeeData.image}`}
                    alt={employeeData.name}
                    className="h-10 w-10 rounded-full"
                  />
                ) : (
                  <UserCircleIcon className="h-10 w-10 text-gray-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {employeeData?.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {employeeData?.designation}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 overflow-y-auto">
            <div className="px-3 py-4 space-y-1">
              {sidebarNavigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => setActiveSection(item.section)}
                  className={`
                    w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium
                    ${activeSection === item.section
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
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
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
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
          {/* Dashboard Overview */}
          {activeSection === 'dashboard' && (
            <DashboardOverview
              employeeData={employeeData}
              tasks={tasks}
              attendance={attendance}
              leaveBalance={leaveBalance}
              payslips={payslips}
            />
          )}

          {/* Profile Section */}
          {activeSection === 'profile' && (
            <ProfileSection
              employeeData={employeeData}
              updateEmployeeData={setEmployeeData}
            />
          )}

          {/* Attendance Section */}
          {activeSection === 'attendance' && (
            <AttendanceSection
              attendance={attendance}
              clockedIn={clockedIn}
              onClockInOut={handleClockInOut}
            />
          )}

          {/* Tasks Section */}
          {activeSection === 'tasks' && (
            <TasksSection
              tasks={tasks}
              updateTaskStatus={updateTaskStatus}
            />
          )}

          {/* Leave Management Section */}
          {activeSection === 'leave' && (
            <LeaveManagement />
          )}

          {/* Training Section */}
          {activeSection === 'training' && (
            <TrainingSection />
          )}

          {/* Documents Section */}
          {activeSection === 'documents' && (
            <DocumentSection />
          )}

          {/* Payroll Section */}
          {activeSection === 'payroll' && (
            <PayrollSection
              payslips={payslips}
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
            />
          )}

          {/* Team Section */}
          {activeSection === 'team' && (
            <TeamSection />
          )}

          {/* Company Section */}
          {activeSection === 'company' && (
            <CompanySection />
          )}

          {/* Settings Section */}
          {activeSection === 'settings' && (
            <SettingsSection />
          )}
        </main>
      </div>

      {/* Modals */}
      {showLeaveModal && (
        <LeaveModal
          show={showLeaveModal}
          onClose={() => setShowLeaveModal(false)}
          onSubmit={handleLeaveSubmit}
          leaveBalance={leaveBalance}
        />
      )}
    </div>
  );
};

export default EmployeeDashboard; 