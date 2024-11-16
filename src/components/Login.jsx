import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Required'),
  password: Yup.string()
    .required('Required')
});

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (token) {
      if (role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else if (role === 'employee') {
        navigate('/employee/dashboard', { replace: true });
      }
    }
  }, [navigate]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setLoading(true);
      console.log('Attempting login with:', values.email);
      
      const loginUrl = 'http://localhost:5000/api/auth/login';
      console.log('Making request to:', loginUrl);

      const response = await axios.post(loginUrl, {
        email: values.email.toLowerCase(),
        password: values.password
      });

      console.log('Login response:', response.data);

      if (response.data.success) {
        const { token, user } = response.data;
        
        // Check if user object has the required properties
        if (!user || !user.id || !user.role) {
          throw new Error('Invalid user data received');
        }

        // Store user data and token
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('role', user.role.toLowerCase());
        localStorage.setItem('userId', user.id);

        // Get user's name from the response, with fallback
        const userName = user.name || user.firstName || 'User';
        toast.success(`Welcome ${userName}!`);
        
        // Role-based navigation
        const roleRoutes = {
          admin: '/admin/dashboard',
          hr: '/hr/dashboard',
          manager: '/manager/dashboard',
          ceo: '/ceo/dashboard',
          employee: '/employee/dashboard'
        };

        const redirectPath = roleRoutes[user.role.toLowerCase()];
        if (redirectPath) {
          navigate(redirectPath);
        } else {
          toast.error('Invalid role assigned');
        }
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url
      });
      
      let errorMessage = 'Login failed. ';
      if (error.response?.status === 404) {
        errorMessage += 'Server endpoint not found. Please check server configuration.';
      } else {
        errorMessage += error.response?.data?.message || error.message || 'Please check your credentials.';
      }
      
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                {/* Company Logo */}
                <Link to="/">
                  <img
                    className="h-12 w-auto"
                    src="/Logo.png" // Add your logo file to public folder
                    alt="Company Logo"
                  />
                </Link>
                {/* Company Name */}
                <span className="ml-3 text-xl font-bold text-gray-800">
                DEALSDRAY ONLINE PVT. LTD
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Login Form */}
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
          </div>
          <Formik
            initialValues={{
              email: '',
              password: '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="mt-8 space-y-6" autoComplete="off">
                <div className="space-y-4">
                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <Field
                      name="email"
                      type="email"
                      autoComplete="off"
                      className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="Email address"
                    />
                    <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <div className="relative mt-1">
                      <Field
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        className="appearance-none block w-full pr-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Enter your password"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-gray-400 hover:text-gray-500 focus:outline-none"
                        >
                          {showPassword ? (
                            <EyeSlashIcon className="h-5 w-5" aria-hidden="true" />
                          ) : (
                            <EyeIcon className="h-5 w-5" aria-hidden="true" />
                          )}
                        </button>
                      </div>
                    </div>
                    <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting || loading}
                    className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                      (isSubmitting || loading) ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {loading ? 'Signing in...' : 'Sign in'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
          <div className="mt-4 text-center">
            <Link to="/reset-password" className="text-sm text-indigo-600 hover:text-indigo-500">
              Forgot your password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
