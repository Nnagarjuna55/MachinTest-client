import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { 
  CalendarIcon, 
  ClockIcon 
} from '@heroicons/react/24/outline';
import Chart from './Chart';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AttendanceSection = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [monthlyAttendance, setMonthlyAttendance] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const fetchMonthlyAttendance = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth() + 1;

        console.log('Fetching attendance for:', { year, month });

        const response = await axios.get(
          `${API_URL}/api/attendance/monthly/${year}/${month}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        setMonthlyAttendance(response.data);
      } catch (error) {
        console.error('Error fetching attendance:', error);
        setError('Failed to load attendance data');
        toast.error('Error loading attendance data');
      } finally {
        setLoading(false);
      }
    };

    fetchMonthlyAttendance();
  }, [selectedDate]);

  if (loading) {
    return (
      <div className="min-h-[400px] flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex justify-center items-center">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Attendance</h2>
        <div className="flex items-center space-x-4">
          <select
            value={selectedDate.getMonth()}
            onChange={(e) => setSelectedDate(new Date(selectedDate.getFullYear(), e.target.value))}
            className="rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>
                {format(new Date(2024, i), 'MMMM')}
              </option>
            ))}
          </select>
          <select
            value={selectedDate.getFullYear()}
            onChange={(e) => setSelectedDate(new Date(e.target.value, selectedDate.getMonth()))}
            className="rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            {Array.from({ length: 3 }, (_, i) => (
              <option key={i} value={2024 - i}>
                {2024 - i}
              </option>
            ))}
          </select>
        </div>
      </div>

      {monthlyAttendance && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <SummaryCard
              title="Total Days"
              value={monthlyAttendance.summary.totalDays}
              icon={CalendarIcon}
            />
            <SummaryCard
              title="Present"
              value={monthlyAttendance.summary.present}
              icon={ClockIcon}
              color="text-green-600"
            />
            <SummaryCard
              title="Absent"
              value={monthlyAttendance.summary.absent}
              icon={ClockIcon}
              color="text-red-600"
            />
            <SummaryCard
              title="Leaves"
              value={monthlyAttendance.summary.leaves}
              icon={CalendarIcon}
              color="text-yellow-600"
            />
          </div>

          {/* Attendance Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Clock In
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Clock Out
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Hours
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {monthlyAttendance.attendance.map((record, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {format(new Date(record.date), 'dd MMM yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${record.status === 'present' ? 'bg-green-100 text-green-800' : 
                          record.status === 'absent' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'}`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{record.clockIn}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{record.clockOut}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{record.totalHours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

const SummaryCard = ({ title, value, icon: Icon, color = "text-gray-900" }) => (
  <div className="bg-gray-50 rounded-lg p-4">
    <div className="flex items-center">
      <div className="flex-shrink-0">
        <Icon className={`h-6 w-6 ${color}`} />
      </div>
      <div className="ml-4">
        <div className="text-sm font-medium text-gray-500">{title}</div>
        <div className={`text-xl font-semibold ${color}`}>{value}</div>
      </div>
    </div>
  </div>
);

export default AttendanceSection; 