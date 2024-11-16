import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  CurrencyDollarIcon,
  ArrowDownTrayIcon,
  ChartBarIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import { Line } from 'react-chartjs-2';

const SalaryCard = ({ title, amount, icon: Icon, color }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center">
      <div className={`p-3 rounded-lg bg-${color}-100 text-${color}-600`}>
        <Icon className="h-6 w-6" />
      </div>
      <div className="ml-4">
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-semibold">${amount}</p>
      </div>
    </div>
  </div>
);

const PayrollSection = () => {
  const [payslips, setPayslips] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [salaryDetails, setSalaryDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch payroll data
  useEffect(() => {
    const fetchPayrollData = async () => {
      setIsLoading(true);
      try {
        const [payslipsRes, salaryRes] = await Promise.all([
          axios.get(`/api/payroll/payslips/${selectedYear}`),
          axios.get('/api/payroll/salary-details')
        ]);
        setPayslips(payslipsRes.data);
        setSalaryDetails(salaryRes.data);
      } catch (error) {
        toast.error('Failed to fetch payroll data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPayrollData();
  }, [selectedYear]);

  // Prepare chart data
  const chartData = {
    labels: payslips.map(p => p.month),
    datasets: [{
      label: 'Net Salary',
      data: payslips.map(p => p.netSalary),
      borderColor: 'rgb(79, 70, 229)',
      tension: 0.1
    }]
  };

  const downloadPayslip = async (payslipId) => {
    try {
      const response = await axios.get(`/api/payroll/download/${payslipId}`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `payslip-${payslipId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error('Failed to download payslip');
    }
  };

  return (
    <div className="space-y-6">
      {/* Salary Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SalaryCard
          title="Basic Salary"
          amount={salaryDetails?.basicSalary}
          icon={CurrencyDollarIcon}
          color="blue"
        />
        <SalaryCard
          title="Total Allowances"
          amount={salaryDetails?.totalAllowances}
          icon={CurrencyDollarIcon}
          color="green"
        />
        <SalaryCard
          title="Net Salary"
          amount={salaryDetails?.netSalary}
          icon={CurrencyDollarIcon}
          color="purple"
        />
      </div>

      {/* Salary Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Salary Trend</h2>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="rounded-md border-gray-300"
          >
            {[...Array(5)].map((_, i) => {
              const year = new Date().getFullYear() - i;
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </select>
        </div>
        <div className="h-64">
          <Line data={chartData} options={{ maintainAspectRatio: false }} />
        </div>
      </div>

      {/* Salary Breakdown */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4">Salary Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2">Earnings</h4>
            <div className="space-y-2">
              {Object.entries(salaryDetails?.earnings || {}).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="text-gray-600">{key}</span>
                  <span className="font-medium">${value}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">Deductions</h4>
            <div className="space-y-2">
              {Object.entries(salaryDetails?.deductions || {}).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="text-gray-600">{key}</span>
                  <span className="font-medium">-${value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Payslips History */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h3 className="text-lg font-medium mb-4">Payslips</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Month
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Net Salary
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Payment Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payslips.map((payslip) => (
                  <tr key={payslip._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {payslip.month}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${payslip.netSalary}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(payslip.paymentDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {payslip.status}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => downloadPayslip(payslip._id)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <ArrowDownTrayIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayrollSection; 