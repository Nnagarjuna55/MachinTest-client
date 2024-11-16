import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  AcademicCapIcon,
  BookOpenIcon,
  CheckCircleIcon,
  ClockIcon,
  PlayIcon,
  XMarkIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';

const API_URL = 'http://localhost:5000';

// Add dummy data
const DUMMY_COURSES = [
  {
    _id: '1',
    title: 'Introduction to Web Development',
    description: 'Learn the basics of HTML, CSS, and JavaScript',
    thumbnail: 'https://placehold.co/600x400?text=Web+Development',
    duration: 20,
    enrolled: false,
    completed: false,
    modules: [
      { title: 'HTML Fundamentals' },
      { title: 'CSS Styling' },
      { title: 'JavaScript Basics' }
    ]
  },
  {
    _id: '2',
    title: 'React.js Fundamentals',
    description: 'Master modern React.js development',
    thumbnail: 'https://placehold.co/600x400?text=React+Course',
    duration: 15,
    enrolled: true,
    completed: false,
    modules: [
      { title: 'React Basics' },
      { title: 'Components & Props' },
      { title: 'State & Lifecycle' }
    ]
  }
];

const DUMMY_CERTIFICATES = [
  {
    _id: '1',
    title: 'Web Development Certificate',
    issueDate: '2024-01-15',
    pdfUrl: '#'
  },
  {
    _id: '2',
    title: 'React.js Advanced Certificate',
    issueDate: '2024-02-20',
    pdfUrl: '#'
  }
];

const CertificateCard = ({ certificate }) => (
  <div className="border rounded-lg p-4">
    <div className="flex items-center justify-between">
      <div>
        <h4 className="font-medium">{certificate.title}</h4>
        <p className="text-sm text-gray-500">
          Issued on {new Date(certificate.issueDate).toLocaleDateString()}
        </p>
      </div>
      <button
        onClick={() => window.open(certificate.pdfUrl, '_blank')}
        className="text-indigo-600 hover:text-indigo-900"
      >
        <ArrowDownTrayIcon className="h-5 w-5" />
      </button>
    </div>
  </div>
);

const CourseDetailsModal = ({ course, onClose, onEnroll }) => (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
    <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
      <div className="flex justify-between items-start">
        <h2 className="text-xl font-semibold">{course.title}</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>
      
      <div className="mt-4">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-64 object-cover rounded-lg"
        />
        
        <div className="mt-4 space-y-4">
          <p className="text-gray-600">{course.description}</p>
          
          <div className="flex items-center space-x-4">
            <span className="flex items-center text-sm text-gray-500">
              <ClockIcon className="h-4 w-4 mr-1" />
              {course.duration} hours
            </span>
            <span className="flex items-center text-sm text-gray-500">
              <BookOpenIcon className="h-4 w-4 mr-1" />
              {course.modules.length} modules
            </span>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Course Modules</h3>
            {course.modules.map((module, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
              >
                <span className="text-sm">{module.title}</span>
                {course.enrolled && (
                  <button className="text-indigo-600 hover:text-indigo-900">
                    <PlayIcon className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {!course.enrolled && (
            <button
              onClick={() => {
                onEnroll(course._id);
                onClose();
              }}
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              Enroll Now
            </button>
          )}
        </div>
      </div>
    </div>
  </div>
);

const CourseCard = ({ course, onEnroll, onSelect }) => (
  <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
    <img
      src={course.thumbnail}
      alt={course.title}
      className="w-full h-48 object-cover"
    />
    <div className="p-4">
      <h3 className="font-medium">{course.title}</h3>
      <p className="text-sm text-gray-500 mt-1">{course.description}</p>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center text-sm text-gray-500">
          <ClockIcon className="h-4 w-4 mr-1" />
          {course.duration} hours
        </div>
        {course.enrolled ? (
          <button
            onClick={() => onSelect(course)}
            className="text-indigo-600 hover:text-indigo-800"
          >
            Continue Learning
          </button>
        ) : (
          <button
            onClick={() => onEnroll(course._id)}
            className="bg-indigo-600 text-white px-3 py-1 rounded-md hover:bg-indigo-700"
          >
            Enroll
          </button>
        )}
      </div>
    </div>
  </div>
);

const TrainingSection = () => {
  const [courses, setCourses] = useState(DUMMY_COURSES);
  const [certificates, setCertificates] = useState(DUMMY_CERTIFICATES);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApiAvailable, setIsApiAvailable] = useState(false);

  useEffect(() => {
    const checkApiAvailability = async () => {
      try {
        await axios.get(`${API_URL}/api/health`);
        setIsApiAvailable(true);
      } catch (error) {
        console.log('API not available, using dummy data');
        setIsApiAvailable(false);
      }
    };

    checkApiAvailability();
  }, []);

  useEffect(() => {
    const fetchTrainingData = async () => {
      if (!isApiAvailable) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        toast.error('Authentication required');
        setIsLoading(false);
        return;
      }

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      try {
        const [coursesRes, certificatesRes] = await Promise.all([
          axios.get(`${API_URL}/api/training/courses`, config),
          axios.get(`${API_URL}/api/training/certificates`, config)
        ]);

        if (coursesRes.data?.length > 0) {
          setCourses(coursesRes.data);
        }
        if (certificatesRes.data?.length > 0) {
          setCertificates(certificatesRes.data);
        }
      } catch (error) {
        console.log('Using dummy data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrainingData();
  }, [isApiAvailable]);

  const handleEnroll = async (courseId) => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (!token || !userId) {
      toast.error('Authentication required');
      return;
    }

    try {
      // Try API call first, fallback to local state update
      try {
        await axios.post(
          `${API_URL}/api/training/enroll/${courseId}`,
          { userId },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        // Try to fetch updated courses
        const response = await axios.get(`${API_URL}/api/training/courses`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (response.data) {
          setCourses(response.data);
        }
      } catch (error) {
        // Update local state if API fails
        const updatedCourses = courses.map(course => 
          course._id === courseId ? { ...course, enrolled: true } : course
        );
        setCourses(updatedCourses);
      }
      
      toast.success('Successfully enrolled in course');
    } catch (error) {
      toast.error('Failed to enroll in course');
    }
  };

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <>
          {/* Training Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="Courses Enrolled"
              value={courses.filter(c => c.enrolled).length}
              icon={BookOpenIcon}
              color="blue"
            />
            <StatCard
              title="Courses Completed"
              value={courses.filter(c => c.completed).length}
              icon={CheckCircleIcon}
              color="green"
            />
            <StatCard
              title="Certificates Earned"
              value={certificates.length}
              icon={AcademicCapIcon}
              color="purple"
            />
          </div>

          {/* Available Courses */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h3 className="text-lg font-medium mb-4">Available Courses</h3>
              {courses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map(course => (
                    <CourseCard
                      key={course._id}
                      course={course}
                      onEnroll={handleEnroll}
                      onSelect={() => setSelectedCourse(course)}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-4">No courses available at the moment</p>
              )}
            </div>
          </div>

          {/* My Certificates */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h3 className="text-lg font-medium mb-4">My Certificates</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {certificates.map(certificate => (
                  <CertificateCard
                    key={certificate._id}
                    certificate={certificate}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Course Details Modal */}
          {selectedCourse && (
            <CourseDetailsModal
              course={selectedCourse}
              onClose={() => setSelectedCourse(null)}
              onEnroll={handleEnroll}
            />
          )}
        </>
      )}
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center">
      <div className={`p-3 rounded-lg bg-${color}-100 text-${color}-600`}>
        <Icon className="h-6 w-6" />
      </div>
      <div className="ml-4">
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-semibold">{value}</p>
      </div>
    </div>
  </div>
);

export default TrainingSection; 