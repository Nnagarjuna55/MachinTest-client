import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  BriefcaseIcon,
  UserCircleIcon,
  ArrowLeftIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';

const validationSchema = Yup.object({
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  mobile: Yup.string()
    .required('Mobile number is required')
    .matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits'),
  designation: Yup.string()
    .required('Designation is required'),
  gender: Yup.string()
    .required('Gender is required'),
  courses: Yup.array()
    .min(1, 'At least one course must be selected')
    .required('Courses are required'),
  image: Yup.mixed()
    .required('Profile image is required'),
  role: Yup.string()
    .required('Role is required')
    .oneOf(['employee', 'HR', 'Manager', 'CEO'], 'Invalid role selected'),
});

// Course options array
const courseOptions = [
  { id: 'mca', label: 'MCA', value: 'MCA' },
  { id: 'bca', label: 'BCA', value: 'BCA' },
  { id: 'bsc', label: 'BSC', value: 'BSC' },
  { id: 'msc', label: 'MSC', value: 'MSC' },
  { id: 'btech', label: 'B.Tech', value: 'BTECH' },
  { id: 'mtech', label: 'M.Tech', value: 'MTECH' },
  { id: 'be', label: 'BE', value: 'BE' },
  { id: 'me', label: 'ME', value: 'ME' },
  { id: 'bba', label: 'BBA', value: 'BBA' },
  { id: 'mba', label: 'MBA', value: 'MBA' },
  { id: 'bcom', label: 'B.Com', value: 'BCOM' },
  { id: 'mcom', label: 'M.Com', value: 'MCOM' },
  { id: 'ba', label: 'BA', value: 'BA' },
  { id: 'ma', label: 'MA', value: 'MA' }
];

export default function CreateEmployee() {
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState(null);

  const initialValues = {
    name: '',
    email: '',
    password: '',
    mobile: '',
    designation: '',
    gender: '',
    courses: [],
    image: null,
    role: 'employee'
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setSubmitError(null);
      const formData = new FormData();
      
      // Add all form fields to formData
      Object.keys(values).forEach(key => {
        if (key === 'courses') {
          formData.append(key, JSON.stringify(values[key]));
        } else if (key === 'image' && values[key]) {
          formData.append(key, values[key]);
        } else {
          formData.append(key, values[key]);
        }
      });

      // Add role explicitly
      formData.append('role', 'employee');

      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication required');
        navigate('/login');
        return;
      }

      const response = await axios.post(
        'http://localhost:5000/api/employees',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        toast.success('Employee created successfully!');
        navigate('/employee-list');
      }
      
    } catch (error) {
      console.error('Error:', error);
      const message = error.response?.data?.message || 'Failed to create employee';
      
      // Check if error is due to authentication
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        localStorage.clear();
        navigate('/login');
        return;
      }
      
      setSubmitError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <button
                onClick={() => navigate(-1)}
                className="mr-4 p-2 rounded-full hover:bg-gray-100"
              >
                <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Create New Employee</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6">
          {submitError && (
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-400 text-red-700">
              <p className="font-medium">Error: {submitError}</p>
            </div>
          )}

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue, isSubmitting, values, errors }) => (
              <Form className="space-y-8 divide-y divide-gray-200 p-8">
                {/* Show general submission error if any */}
                {errors.submit && (
                  <div className="rounded-md bg-red-50 p-4 mb-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">
                          {errors.submit}
                        </h3>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-8 divide-y divide-gray-200">
                  {/* Personal Information Section */}
                  <div>
                    <div>
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Personal Information
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Please provide the employee's basic information.
                      </p>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      {/* Profile Image Upload */}
                      <div className="sm:col-span-6">
                        <div className="flex items-center">
                          <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-100">
                            {imagePreview ? (
                              <img
                                src={imagePreview}
                                alt="Preview"
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <UserCircleIcon className="h-24 w-24 text-gray-300" />
                            )}
                          </div>
                          <div className="ml-5">
                            <div className="relative">
                              <input
                                type="file"
                                onChange={(event) => {
                                  setFieldValue("image", event.currentTarget.files[0]);
                                  setImagePreview(URL.createObjectURL(event.currentTarget.files[0]));
                                }}
                                className="hidden"
                                id="user-photo"
                              />
                              <label
                                htmlFor="user-photo"
                                className="bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
                              >
                                Change photo
                              </label>
                            </div>
                            <p className="mt-2 text-xs text-gray-500">
                              JPG, PNG, GIF up to 10MB
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Name Field */}
                      <div className="sm:col-span-3">
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <UserIcon className="h-5 w-5 text-gray-400" />
                          </div>
                          <Field
                            name="name"
                            type="text"
                            placeholder="Full Name"
                            className="pl-10 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        <ErrorMessage name="name" component="div" className="mt-1 text-sm text-red-600" />
                      </div>

                      {/* Email Field */}
                      <div className="sm:col-span-3">
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                          </div>
                          <Field
                            name="email"
                            type="email"
                            placeholder="Email Address"
                            className="pl-10 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        <ErrorMessage name="email" component="div" className="mt-1 text-sm text-red-600" />
                      </div>

                      {/* Password Field */}
                      <div className="sm:col-span-3">
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <LockClosedIcon className="h-5 w-5 text-gray-400" />
                          </div>
                          <Field
                            name="password"
                            type="password"
                            placeholder="Password"
                            className="pl-10 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        <ErrorMessage 
                          name="password" 
                          component="div" 
                          className="mt-1 text-sm text-red-600" 
                        />
                      </div>

                      {/* Mobile Field */}
                      <div className="sm:col-span-3">
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <PhoneIcon className="h-5 w-5 text-gray-400" />
                          </div>
                          <Field
                            name="mobile"
                            type="text"
                            placeholder="Mobile Number"
                            className="pl-10 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        <ErrorMessage name="mobile" component="div" className="mt-1 text-sm text-red-600" />
                      </div>

                      {/* Designation Field */}
                      <div className="sm:col-span-3">
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <BriefcaseIcon className="h-5 w-5 text-gray-400" />
                          </div>
                          <Field
                            as="select"
                            name="designation"
                            placeholder="Designation"
                            className="pl-10 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                          >
                            <option value="">Select Designation</option>
                            <option value="HR">HR</option>
                            <option value="Manager">Manager</option>
                            <option value="Developer">Developer</option>
                            <option value="Designer">Designer</option>
                            <option value="Analyst">Analyst</option>
                            <option value="Consultant">Consultant</option>
                            <option value="Team Lead">Team Lead</option>
                            <option value="Project Manager">Project Manager</option>
                            <option value="Director">Director</option>
                          </Field>
                        </div>
                        <ErrorMessage name="designation" component="div" className="mt-1 text-sm text-red-600" />
                      </div>

                      {/* Gender Field */}
                      <div className="sm:col-span-3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                        <div className="space-x-4">
                          <label className="inline-flex items-center">
                            <Field
                              type="radio"
                              name="gender"
                              value="Male"
                              className="form-radio text-indigo-600"
                            />
                            <span className="ml-2">Male</span>
                          </label>
                          <label className="inline-flex items-center">
                            <Field
                              type="radio"
                              name="gender"
                              value="Female"
                              className="form-radio text-indigo-600"
                            />
                            <span className="ml-2">Female</span>
                          </label>
                        </div>
                        <ErrorMessage name="gender" component="div" className="mt-1 text-sm text-red-600" />
                      </div>
                    </div>
                  </div>

                  {/* Courses Field */}
                  <div>
                    <div>
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Courses
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Please select the courses the employee has completed.
                      </p>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      {courseOptions.map((course) => (
                        <div key={course.id} className="sm:col-span-2">
                          <div className="mt-2 space-x-4">
                            <label className="inline-flex items-center">
                              <Field
                                type="checkbox"
                                name="courses"
                                value={course.value}
                                className="form-checkbox text-indigo-600 rounded"
                              />
                              <span className="ml-2">{course.label}</span>
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Add Role Selection */}
                <div className="sm:col-span-3">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserCircleIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <Field
                      as="select"
                      name="role"
                      className="pl-10 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                    >
                      <option value="">Select Role</option>
                      <option value="employee">Employee</option>
                      <option value="HR">HR</option>
                      <option value="Manager">Manager</option>
                      <option value="CEO">CEO</option>
                    </Field>
                  </div>
                  <ErrorMessage name="role" component="div" className="mt-1 text-sm text-red-600" />
                </div>

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                      isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? 'Creating...' : 'Create Employee'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
} 