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
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  const role = localStorage.getItem('role')?.toLowerCase();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && role !== allowedRole.toLowerCase()) {
    // Redirect to appropriate dashboard based on role
    const roleRoutes = {
      admin: '/admin/dashboard',
      employee: '/employee/dashboard',
      hr: '/hr/dashboard',
      manager: '/manager/dashboard',
      ceo: '/ceo/dashboard'
    };
    return <Navigate to={roleRoutes[role] || '/login'} replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRole="admin">
              <Routes>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="create-employee" element={<CreateEmployee />} />
                <Route path="employee-list" element={<EmployeeList />} />
                <Route path="search-employee" element={<SearchEmployee />} />
                <Route path="edit-employee/:id" element={<EditEmployee />} />
              </Routes>
            </ProtectedRoute>
          }
        />

        {/* Protected HR Routes */}
        <Route
          path="/hr/*"
          element={
            <ProtectedRoute allowedRole="hr">
              <Routes>
                <Route path="dashboard" element={<HRDashboard />} />
                <Route path="create-employee" element={<CreateEmployee />} />
                <Route path="employee-list" element={<EmployeeList />} />
              </Routes>
            </ProtectedRoute>
          }
        />

        {/* Protected Manager Routes */}
        <Route
          path="/manager/*"
          element={
            <ProtectedRoute allowedRole="manager">
              <Routes>
                <Route path="dashboard" element={<ManagerDashboard />} />
                <Route path="team" element={<EmployeeList />} />
              </Routes>
            </ProtectedRoute>
          }
        />

        {/* Protected CEO Routes */}
        <Route
          path="/ceo/*"
          element={
            <ProtectedRoute allowedRole="ceo">
              <Routes>
                <Route path="dashboard" element={<CEODashboard />} />
              </Routes>
            </ProtectedRoute>
          }
        />

        {/* Protected Employee Routes */}
        <Route
          path="/employee/*"
          element={
            <ProtectedRoute allowedRole="employee">
              <Routes>
                <Route path="dashboard" element={<EmployeeDashboard />} />
              </Routes>
            </ProtectedRoute>
          }
        />

        {/* Default Route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Router>
  );
}

export default App;