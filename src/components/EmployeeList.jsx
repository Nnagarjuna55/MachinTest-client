import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  TrashIcon,
  PencilIcon,
  EyeIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import EditEmployee from './EditEmployee';
import Modal from './Modal';

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get(`${API_URL}/api/employees`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setEmployees(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching employees:', error);

      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError('Failed to load employees');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      await axios.delete(`${API_URL}/api/employees/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Remove employee from state
      setEmployees(prevEmployees => 
        prevEmployees.filter(employee => employee._id !== id)
      );

      toast.success('Employee deleted successfully');
    } catch (error) {
      console.error('Error deleting employee:', error);

      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        toast.error(error.response?.data?.message || 'Error deleting employee');
      }
    }
  };

  const handleEditClick = (employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back
          </button>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Employees</h1>
          <Link
            to="/create-employee"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Add Employee
          </Link>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b-2 border-gray-300 border-r border-gray-300">Unique Id</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b-2 border-gray-300 border-r border-gray-300">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b-2 border-gray-300 border-r border-gray-300">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b-2 border-gray-300 border-r border-gray-300">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b-2 border-gray-300 border-r border-gray-300">Mobile No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b-2 border-gray-300 border-r border-gray-300">Designation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b-2 border-gray-300 border-r border-gray-300">Gender</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b-2 border-gray-300 border-r border-gray-300">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b-2 border-gray-300 border-r border-gray-300">Create Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b-2 border-gray-300">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employees.map((employee, index) => (
                <tr key={employee._id} className="border-b border-gray-300">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-b border-gray-300 border-r border-gray-300">{`EMP-${index + 1}`}</td>
                  <td className="px-6 py-4 whitespace-nowrap border-b border-gray-300 border-r border-gray-300">
                    {employee.image && (
                      <img
                        src={`http://localhost:5000/api/uploads/${employee.image}`}
                        alt={employee.name}
                        className="h-10 w-10 rounded-full"
                      />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b border-gray-300 border-r border-gray-300">{employee.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b border-gray-300 border-r border-gray-300">{employee.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b border-gray-300 border-r border-gray-300">{employee.mobile}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b border-gray-300 border-r border-gray-300">{employee.designation}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b border-gray-300 border-r border-gray-300">{employee.gender}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b border-gray-300 border-r border-gray-300">
                    {Array.from(new Set(employee.courses.map(course => course.toUpperCase()))).join(', ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b border-gray-300 border-r border-gray-300">{new Date(employee.createDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b border-gray-300">
                    <button
                      onClick={() => handleEditClick(employee)}
                      className="text-yellow-600 hover:text-yellow-900"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(employee._id)}
                      className="text-red-600 hover:text-red-900 ml-2"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        {selectedEmployee && (
          <EditEmployee employee={selectedEmployee} onClose={handleCloseModal} />
        )}
      </Modal>
    </div>
  );
}

