import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  CurrencyDollarIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon,
  CalendarIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import StatCard from './shared/StatCard';

const PayrollManagement = () => {
  const [payrollData, setPayrollData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [payrollSummary, setPayrollSummary] = useState({
    totalSalary: 0,
    totalDeductions: 0,
    totalBonuses: 0,
    netPayable: 0,
  });

  useEffect(() => {
    fetchPayrollData();
  }, [selectedMonth]);

  const fetchPayrollData = async () => {
    try {
      const response = await axios.get(`/api/payroll/month/${selectedMonth.toISOString()}`);
      setPayrollData(response.data.payroll);
      setPayrollSummary(response.data.summary);
    } catch (error) {
      toast.error('Failed to fetch payroll data');
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePayslips = async () => {
    try {
      await axios.post('/api/payroll/generate-payslips', {
        month: selectedMonth.toISOString(),
      });
      toast.success('Payslips generated successfully');
      fetchPayrollData();
    } catch (error) {
      toast.error('Failed to generate payslips');
    }
  };

  const handleApprovePayroll = async () => {
    try {
      await axios.post('/api/payroll/approve', {
        month: selectedMonth.toISOString(),
      });
      toast.success('Payroll approved successfully');
      fetchPayrollData();
    } catch (error) {
      toast.error('Failed to approve payroll');
    }
  };

  return (
    <div className="space-y-6">
      {/* Payroll Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Salary"
          value={`$${payrollSummary.totalSalary.toLocaleString()}`}
          icon={CurrencyDollarIcon}
          color="blue"
        />
        <StatCard
          title="Total Deductions"
          value={`$${payrollSummary.totalDeductions.toLocaleString()}`}
          icon={CurrencyDollarIcon}
          color="red"
        />
        <StatCard
          title="Total Bonuses"
          value={`$${payrollSummary.totalBonuses.toLocaleString()}`}
          icon={CurrencyDollarIcon}
          color="green"
        />
        <StatCard
          title="Net Payable"
          value={`$${payrollSummary.netPayable.toLocaleString()}`}
          icon={CurrencyDollarIcon}
          color="indigo"
        />
      </div>

      {/* Payroll Controls */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-wrap gap-4 justify-between items-center">
          <div className="flex space-x-4">
            <div className="flex items-center">
              <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="month"
                value={selectedMonth.toISOString().slice(0, 7)}
                onChange={(e) => setSelectedMonth(new Date(e.target.value))}
                className="rounded-lg border-gray-300"
              />
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleGeneratePayslips}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <DocumentTextIcon className="h-5 w-5 mr-2" />
              Generate Payslips
            </button>
            <button
              onClick={handleApprovePayroll}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <CheckIcon className="h-5 w-5 mr-2" />
              Approve Payroll
            </button>
          </div>
        </div>
      </div>

      {/* Payroll Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employee
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Basic Salary
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Deductions
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bonuses
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Net Salary
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payrollData.map(employee => (
              <tr key={employee.id}>
                <td className="px-6 py-4 whitespace-nowrap">{employee.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{employee.basicSalary}</td>
                <td className="px-6 py-4 whitespace-nowrap">{employee.deductions}</td>
                <td className="px-6 py-4 whitespace-nowrap">{employee.bonuses}</td>
                <td className="px-6 py-4 whitespace-nowrap">{employee.netSalary}</td>
                <td className="px-6 py-4 whitespace-nowrap">{employee.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PayrollManagement; 