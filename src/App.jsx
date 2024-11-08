import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import EmployeeDashboard from './components/EmployeeDashboard';
import Dashboard from './components/Dashboard';
import CreateEmployee from './components/CreateEmployee';
import EmployeeList from './components/EmployeeList';
import SearchEmployee from './components/SearchEmployee';
import EditEmployee from './components/EditEmployee';
import ResetPassword from './components/ResetPassword';
import HRDashboard from './components/HRDashboard';
import ManagerDashboard from './components/ManagerDashboard';
import CEODashboard from './components/CEODashboard';
import axios from 'axios';

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Protected Route Component
const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && role !== allowedRole) {
    return <Navigate to={role === 'admin' ? '/admin/dashboard' : '/employee/dashboard'} replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />
        {/* Protected Employee Routes */}
        <Route
          path="/employee/dashboard"
          element={
            <ProtectedRoute allowedRole="employee">
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />

        {/* Protected Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRole="admin">
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/create-employee"
          element={
            <ProtectedRoute allowedRole="admin">
              <CreateEmployee />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/employee-list"
          element={
            <ProtectedRoute allowedRole="admin">
              <EmployeeList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/search-employee"
          element={
            <ProtectedRoute allowedRole="admin">
              <SearchEmployee />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/edit-employee/:id"
          element={
            <ProtectedRoute allowedRole="admin">
              <EditEmployee />
            </ProtectedRoute>
          }
        />
        <Route path="/admin/employee/edit/:id" element={<EditEmployee />} />

        {/* Reset Password Route */}
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* HR Dashboard Route */}
        <Route path="/hr/dashboard" element={<HRDashboard />} />

        {/* Manager Dashboard Route */}
        <Route path="/manager/dashboard" element={<ManagerDashboard />} />

        {/* CEO Dashboard Route */}
        <Route path="/ceo/dashboard" element={<CEODashboard />} />

        {/* Default Route */}
        <Route
          path="*"
          element={
            <Navigate to="/login" replace />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;