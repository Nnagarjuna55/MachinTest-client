import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  DocumentChartBarIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import { Line, Bar } from 'react-chartjs-2';

const Reports = () => {
  const [reportType, setReportType] = useState('attendance');
  const [dateRange, setDateRange] = useState('month');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  const reportTypes = [
    { id: 'attendance', name: 'Attendance Report' },
    { id: 'performance', name: 'Performance Report' },
    { id: 'leave', name: 'Leave Report' },
    { id: 'payroll', name: 'Payroll Report' },
    { id: 'training', name: 'Training Report' }
  ];

  useEffect(() => {
    fetchReportData();
  }, [reportType, dateRange]);

  const fetchReportData = async () => {
    try {
      const response = await axios.get(`/api/reports/${reportType}?range=${dateRange}`);
      setReportData(response.data);
    } catch (error) {
      toast.error('Failed to fetch report data');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format) => {
    try {
      const response = await axios.get(
        `/api/reports/${reportType}/export?range=${dateRange}&format=${format}`,
        { responseType: 'blob' }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${reportType}_report.${format}`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      toast.error('Failed to export report');
    }
  };

  return (
    <div className="space-y-6">
      {/* Report Controls */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-wrap gap-4 justify-between items-center">
          <div className="flex space-x-4">
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="rounded-lg border-gray-300"
            >
              {reportTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="rounded-lg border-gray-300"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handleExport('pdf')}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
              Export PDF
            </button>
            <button
              onClick={() => handleExport('excel')}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
              Export Excel
            </button>
          </div>
        </div>
      </div>

      {/* Report Content */}
      <div className="bg-white rounded-lg shadow p-6">
        <ReportContent type={reportType} data={reportData} loading={loading} />
      </div>
    </div>
  );
};

const ReportContent = ({ type, data, loading }) => {
  if (loading) return <div>Loading...</div>;
  if (!data) return <div>No data available</div>;

  switch (type) {
    case 'attendance':
      return <AttendanceReport data={data} />;
    case 'performance':
      return <PerformanceReport data={data} />;
    case 'leave':
      return <LeaveReport data={data} />;
    case 'payroll':
      return <PayrollReport data={data} />;
    case 'training':
      return <TrainingReport data={data} />;
    default:
      return <div>Select a report type</div>;
  }
};

// Add report components
const AttendanceReport = ({ data }) => {
  return <div>{/* Implementation */}</div>;
};

const PerformanceReport = ({ data }) => {
  return <div>{/* Implementation */}</div>;
};

const LeaveReport = ({ data }) => {
  return <div>{/* Implementation */}</div>;
};

const PayrollReport = ({ data }) => {
  return <div>{/* Implementation */}</div>;
};

const TrainingReport = ({ data }) => {
  return <div>{/* Implementation */}</div>;
};

export default Reports; 