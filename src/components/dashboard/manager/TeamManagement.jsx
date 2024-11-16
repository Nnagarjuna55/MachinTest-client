import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '../../../config/config';

const TeamManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define fetchTeamData using useCallback to prevent unnecessary re-renders
  const fetchTeamData = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [employeesRes, departmentsRes] = await Promise.all([
        axios.get(`${API_URL}/api/employees`),
        axios.get(`${API_URL}/api/department/list`)
      ]);

      setEmployees(employeesRes.data);
      setDepartments(departmentsRes.data);
    } catch (error) {
      console.error('Error fetching team data:', error);
      setError('Failed to fetch team data');
      toast.error('Failed to fetch team data');
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array since we don't use any external values

  useEffect(() => {
    fetchTeamData();
  }, [fetchTeamData]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="team-management">
      <div className="header">
        <h2>Team Management</h2>
        <button onClick={fetchTeamData}>Refresh</button>
      </div>
      
      <div className="departments-section">
        <h3>Departments</h3>
        <div className="departments-list">
          {departments.map(dept => (
            <div key={dept.id} className="department-card">
              <h4>{dept.name}</h4>
              <p>Employees: {dept.employeeCount}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="employees-section">
        <h3>Team Members</h3>
        <div className="employees-list">
          {employees.map(employee => (
            <div key={employee.id} className="employee-card">
              <h4>{employee.name}</h4>
              <p>Department: {employee.department}</p>
              <p>Role: {employee.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamManagement; 