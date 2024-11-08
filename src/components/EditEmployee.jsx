import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function EditEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/employees/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log('Fetched employee data:', response.data); // Debug log
        
        setInitialValues({
          name: response.data.name || '',
          email: response.data.email || '',
          mobile: response.data.mobile || '',
          designation: response.data.designation || '',
          gender: response.data.gender || '',
          courses: response.data.courses || [],
          role: response.data.role || 'employee'
        });
      } catch (error) {
        console.error('Error fetching employee:', error);
        toast.error('Failed to fetch employee data');
        navigate('/employee-list');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id, navigate]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      Object.keys(values).forEach(key => {
        if (key === 'courses') {
          formData.append(key, JSON.stringify(values[key]));
        } else if (key === 'image' && values[key] instanceof File) {
          formData.append(key, values[key]);
        } else {
          formData.append(key, values[key]);
        }
      });

      await axios.put(`http://localhost:5000/api/employees/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Employee updated successfully');
      navigate('/employee-list');
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update employee');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!initialValues) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-red-600">Failed to load employee data</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-2xl font-bold mb-6">Edit Employee</h1>
            <Formik
              initialValues={initialValues}
              validationSchema={Yup.object({
                name: Yup.string().required('Required'),
                email: Yup.string().email('Invalid email').required('Required'),
                mobile: Yup.string()
                  .matches(/^[0-9]{10}$/, 'Must be exactly 10 digits')
                  .required('Required'),
                designation: Yup.string().required('Required'),
                gender: Yup.string().required('Required'),
                courses: Yup.array().min(1, 'Select at least one course'),
                role: Yup.string().required('Required')
              })}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-6">
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                    {/* Name Field */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <Field
                        type="text"
                        name="name"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                      <ErrorMessage name="name" component="div" className="mt-1 text-sm text-red-600" />
                    </div>

                    {/* Email Field */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <Field
                        type="email"
                        name="email"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                      <ErrorMessage name="email" component="div" className="mt-1 text-sm text-red-600" />
                    </div>

                    {/* Mobile Field */}
                    <div>
                      <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
                        Mobile
                      </label>
                      <Field
                        type="text"
                        name="mobile"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                      <ErrorMessage name="mobile" component="div" className="mt-1 text-sm text-red-600" />
                    </div>

                    {/* Designation Field */}
                    <div>
                      <label htmlFor="designation" className="block text-sm font-medium text-gray-700">
                        Designation
                      </label>
                      <Field
                        as="select"
                        name="designation"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option value="">Select Designation</option>
                        <option value="Developer">Developer</option>
                        <option value="Designer">Designer</option>
                        <option value="Manager">Manager</option>
                        <option value="HR">HR</option>
                      </Field>
                      <ErrorMessage name="designation" component="div" className="mt-1 text-sm text-red-600" />
                    </div>

                    {/* Gender Field */}
                    <div>
                      <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                        Gender
                      </label>
                      <Field
                        as="select"
                        name="gender"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </Field>
                      <ErrorMessage name="gender" component="div" className="mt-1 text-sm text-red-600" />
                    </div>

                    {/* Role Field */}
                    <div>
                      <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                        Role
                      </label>
                      <Field
                        as="select"
                        name="role"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option value="">Select Role</option>
                        <option value="employee">Employee</option>
                        <option value="HR">HR</option>
                        <option value="Manager">Manager</option>
                        <option value="CEO">CEO</option>
                      </Field>
                      <ErrorMessage name="role" component="div" className="mt-1 text-sm text-red-600" />
                    </div>

                    {/* Courses Field */}
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Courses</label>
                      <div className="mt-2 grid grid-cols-2 gap-4">
                        {['MCA', 'BCA', 'BSc', 'MSc', 'BTech', 'MTech'].map((course) => (
                          <div key={course}>
                            <label className="inline-flex items-center">
                              <Field
                                type="checkbox"
                                name="courses"
                                value={course}
                                className="form-checkbox h-4 w-4 text-indigo-600"
                              />
                              <span className="ml-2">{course}</span>
                            </label>
                          </div>
                        ))}
                      </div>
                      <ErrorMessage name="courses" component="div" className="mt-1 text-sm text-red-600" />
                    </div>
                  </div>

                  {/* Submit and Cancel Buttons */}
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => navigate('/employee-list')}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}