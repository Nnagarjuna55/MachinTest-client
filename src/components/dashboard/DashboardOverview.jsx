import React from 'react';
import {
  ChartBarIcon,
  ClockIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// StatCard component
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

const DashboardOverview = ({ employeeData, tasks, attendance, leaveBalance, payslips }) => {
  // Attendance chart data
  const attendanceData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [{
      label: 'Hours Worked',
      data: attendance?.weeklyHours || [8, 7.5, 8, 8, 7],
      borderColor: 'rgb(79, 70, 229)',
      backgroundColor: 'rgba(79, 70, 229, 0.1)',
      tension: 0.4,
      fill: true,
    }]
  };

  // Tasks chart data
  const taskData = {
    labels: ['Completed', 'In Progress', 'Pending'],
    datasets: [{
      data: [
        tasks?.filter(t => t.status === 'completed').length || 0,
        tasks?.filter(t => t.status === 'in-progress').length || 0,
        tasks?.filter(t => t.status === 'pending').length || 0,
      ],
      backgroundColor: [
        'rgb(34, 197, 94)',
        'rgb(249, 115, 22)',
        'rgb(239, 68, 68)',
      ]
    }]
  };

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Tasks"
          value={`${tasks?.filter(t => t.status === 'completed').length || 0}/${tasks?.length || 0}`}
          icon={ChartBarIcon}
          color="green"
        />
        <StatCard
          title="Attendance"
          value={`${attendance?.weeklyHours?.reduce((a, b) => a + b, 0) || 0} hours`}
          icon={ClockIcon}
          color="blue"
        />
        <StatCard
          title="Leave Balance"
          value={`${leaveBalance?.daysRemaining || 0} days`}
          icon={CalendarIcon}
          color="yellow"
        />
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium">Tasks Overview</h3>
          <Line data={taskData} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium">Attendance</h3>
          <Line data={attendanceData} />
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview; 