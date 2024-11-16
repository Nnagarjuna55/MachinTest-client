import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  CalendarIcon,
  ClockIcon,
  UserGroupIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import StatCard from './shared/StatCard';

const AttendanceManagement = () => {
  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    present: 0,
    absent: 0,
    late: 0,
    onLeave: 0,
  });

  useEffect(() => {
    fetchAttendanceData();
  }, [selectedDate, selectedDepartment]);

  const fetchAttendanceData = async () => {
    try {
      const [attendanceRes, employeesRes] = await Promise.all([
        axios.get(`/api/attendance?date=${selectedDate.toISOString()}&department=${selectedDepartment}`),
        axios.get('/api/employees')
      ]);
      setAttendance(attendanceRes.data);
      setEmployees(employeesRes.data);
      calculateStats(attendanceRes.data);
    } catch (error) {
      toast.error('Failed to fetch attendance data');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (attendanceData) => {
    const stats = attendanceData.reduce((acc, curr) => {
      acc[curr.status]++;
      return acc;
    }, { present: 0, absent: 0, late: 0, onLeave: 0 });
    setStats(stats);
  };

  const exportAttendance = async () => {
    try {
      const response = await axios.get('/api/attendance/export', {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `attendance_${selectedDate.toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      toast.error('Failed to export attendance data');
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Present" value={stats.present} icon={UserGroupIcon} color="green" />
        <StatCard title="Absent" value={stats.absent} icon={UserGroupIcon} color="red" />
        <StatCard title="Late" value={stats.late} icon={ClockIcon} color="yellow" />
        <StatCard title="On Leave" value={stats.onLeave} icon={CalendarIcon} color="blue" />
      </div>

      {/* Filters and Actions */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="rounded-lg border-gray-300"
          >
            <option value="all">All Departments</option>
            {/* Add department options */}
          </select>
          <button
            onClick={exportAttendance}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Calendar and Attendance List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-4">
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              className="w-full"
            />
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Clock In
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Clock Out
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attendance.map((record) => (
                  <AttendanceRow key={record._id} record={record} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const AttendanceRow = ({ record }) => (
  <tr>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        <div className="flex-shrink-0 h-10 w-10">
          <img
            className="h-10 w-10 rounded-full"
            src={record.employee.avatar || '/default-avatar.png'}
            alt=""
          />
        </div>
        <div className="ml-4">
          <div className="text-sm font-medium text-gray-900">
            {record.employee.name}
          </div>
          <div className="text-sm text-gray-500">
            {record.employee.department}
          </div>
        </div>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {record.clockIn ? new Date(record.clockIn).toLocaleTimeString() : '-'}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {record.clockOut ? new Date(record.clockOut).toLocaleTimeString() : '-'}
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
        ${record.status === 'present' ? 'bg-green-100 text-green-800' :
          record.status === 'absent' ? 'bg-red-100 text-red-800' :
          record.status === 'late' ? 'bg-yellow-100 text-yellow-800' :
          'bg-blue-100 text-blue-800'}`}>
        {record.status}
      </span>
    </td>
  </tr>
);

export default AttendanceManagement;