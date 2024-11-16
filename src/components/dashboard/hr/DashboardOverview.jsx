import React from 'react';
import {
  UserGroupIcon,
  BriefcaseIcon,
  CalendarIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

// StatCard Component
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

// DepartmentCard Component
const DepartmentCard = ({ departments }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h3 className="text-lg font-medium mb-4">Department Distribution</h3>
    <div className="space-y-4">
      {departments.map((dept) => (
        <div key={dept.name} className="flex items-center justify-between">
          <span className="text-gray-600">{dept.name}</span>
          <span className="font-medium">{dept.count}</span>
        </div>
      ))}
    </div>
  </div>
);

// RecentHiresCard Component
const RecentHiresCard = ({ recentHires }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h3 className="text-lg font-medium mb-4">Recent Hires</h3>
    <div className="space-y-4">
      {recentHires.map((hire) => (
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
);

const DashboardOverview = ({ stats }) => {
  return (
    <div className="space-y-6">
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

      {/* Department Distribution and Recent Hires */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DepartmentCard departments={stats.departments} />
        <RecentHiresCard recentHires={stats.recentHires} />
      </div>
    </div>
  );
};

export default DashboardOverview; 