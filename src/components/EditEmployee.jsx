import { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { UserCircleIcon, EnvelopeIcon, PhoneIcon, BriefcaseIcon, CalendarIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { toast } from 'react-toastify';

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

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  mobile: Yup.string().required('Mobile number is required').matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits'),
  designation: Yup.string().required('Designation is required'),
  gender: Yup.string().required('Gender is required'),
  createDate: Yup.date().required('Create date is required'),
  courses: Yup.array().min(1, 'At least one course must be selected').required('Courses are required'),
  image: Yup.mixed().required('Profile image is required'),
});

export default function EditEmployee({ employee, onClose }) {
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (employee) {
      setImagePreview(`http://localhost:5000/api/uploads/${employee.image}`);
    }
  }, [employee]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('email', values.email);
      formData.append('mobile', values.mobile);
      formData.append('designation', values.designation);
      formData.append('gender', values.gender);
      formData.append('createDate', values.createDate);
      formData.append('image', values.image);
      values.courses.forEach(course => formData.append('courses', course));

      await axios.put(`http://localhost:5000/api/employees/${employee._id}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      window.location.reload();


      toast.success('Employee updated successfully');
      onClose();
    } catch (error) {
      console.error('Error updating employee:', error);
      toast.error('Failed to update employee');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6 max-h-[80vh] overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Edit Employee</h2>
          <Formik
            initialValues={{
              name: employee.name,
              email: employee.email,
              mobile: employee.mobile,
              designation: employee.designation,
              gender: employee.gender,
              createDate: new Date(employee.createDate).toISOString().split('T')[0],
              courses: employee.courses.map(course => course.toUpperCase()) || [],
              image: null,
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue, values, isSubmitting }) => (
              <Form className="space-y-8 divide-y divide-gray-200 p-8" autoComplete="off">
                {/* Profile Image Upload */}
                <div className="mb-6">
                  <div className="flex items-center">
                    <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-100">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                      ) : (
                        <UserCircleIcon className="h-24 w-24 text-gray-300" />
                      )}
                    </div>
                    <div className="ml-5">
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
                      <p className="mt-2 text-xs text-gray-500">JPG, PNG, GIF up to 10MB</p>
                    </div>
                  </div>
                </div>

                {/* Personal Information Section */}
                <div className="mb-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Personal Information</h3>
                  <p className="mt-1 text-sm text-gray-500">Please provide the employee's basic information.</p>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  {/* Name Field */}
                  <div className="sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserCircleIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <Field
                        name="name"
                        type="text"
                        autoComplete="off"
                        placeholder="Full Name"
                        className="pl-10 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    <ErrorMessage name="name" component="div" className="mt-1 text-sm text-red-600 font-medium" />
                  </div>

                  {/* Email Field */}
                  <div className="sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <Field
                        name="email"
                        type="email"
                        autoComplete="off"
                        placeholder="Email Address"
                        className="pl-10 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    <ErrorMessage name="email" component="div" className="mt-1 text-sm text-red-600 font-medium" />
                  </div>

                  {/* Mobile Field */}
                  <div className="sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <PhoneIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <Field
                        name="mobile"
                        type="text"
                        autoComplete="off"
                        placeholder="Mobile Number"
                        className="pl-10 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    <ErrorMessage name="mobile" component="div" className="mt-1 text-sm text-red-600 font-medium" />
                  </div>

                  {/* Designation Field */}
                  <div className="sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <BriefcaseIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <Field
                        as="select"
                        name="designation"
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
                        <option value="Ceo">CEO</option>
                      </Field>
                    </div>
                    <ErrorMessage name="designation" component="div" className="mt-1 text-sm text-red-600 font-medium" />
                  </div>

                  {/* Gender Field */}
                  <div className="sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
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
                    <ErrorMessage name="gender" component="div" className="mt-1 text-sm text-red-600 font-medium" />
                  </div>

                  {/* Create Date Field */}
                  <div className="sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Create Date</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CalendarIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <Field
                        name="createDate"
                        type="date"
                        className="pl-10 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    <ErrorMessage name="createDate" component="div" className="mt-1 text-sm text-red-600 font-medium" />
                  </div>

                  {/* Courses Field */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Courses</label>
                    <div className="grid grid-cols-2 gap-4">
                      {courseOptions.map((course) => (
                        <div key={course.id} className="flex items-center">
                          <Field
                            type="checkbox"
                            name="courses"
                            value={course.value.toUpperCase()}
                            className="form-checkbox text-indigo-600 rounded"
                            checked={values.courses.includes(course.value.toUpperCase())}
                            onChange={() => {
                              const currentCourses = values.courses;
                              if (currentCourses.includes(course.value.toUpperCase())) {
                                setFieldValue("courses", currentCourses.filter(c => c !== course.value.toUpperCase()));
                              } else {
                                setFieldValue("courses", [...currentCourses, course.value.toUpperCase()]);
                              }
                            }}
                          />
                          <span className="ml-2">{course.label}</span>
                        </div>
                      ))}
                    </div>
                    <ErrorMessage name="courses" component="div" className="mt-1 text-sm text-red-600 font-medium" />
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={onClose}
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
  );
}

