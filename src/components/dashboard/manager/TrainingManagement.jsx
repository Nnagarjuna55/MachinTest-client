import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  AcademicCapIcon,
  BookOpenIcon,
  UserGroupIcon,
  PlusIcon,
  CheckCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import StatCard from './shared/StatCard';

const TrainingManagement = () => {
  const [courses, setCourses] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [trainingStats, setTrainingStats] = useState({
    totalCourses: 0,
    activeEnrollments: 0,
    completionRate: 0,
  });

  useEffect(() => {
    fetchTrainingData();
  }, []);

  const fetchTrainingData = async () => {
    try {
      const [coursesRes, employeesRes] = await Promise.all([
        axios.get('/api/training/courses'),
        axios.get('/api/employees')
      ]);
      setCourses(coursesRes.data);
      setEmployees(employeesRes.data);
      calculateStats(coursesRes.data);
    } catch (error) {
      toast.error('Failed to fetch training data');
    }
  };

  const calculateStats = (coursesData) => {
    // Calculate training statistics
    const stats = {
      totalCourses: coursesData.length,
      activeEnrollments: coursesData.reduce((acc, course) => 
        acc + course.enrollments.length, 0),
      completionRate: calculateCompletionRate(coursesData),
    };
    setTrainingStats(stats);
  };

  return (
    <div className="space-y-6">
      {/* Training Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Courses"
          value={trainingStats.totalCourses}
          icon={BookOpenIcon}
          color="blue"
        />
        <StatCard
          title="Active Enrollments"
          value={trainingStats.activeEnrollments}
          icon={UserGroupIcon}
          color="green"
        />
        <StatCard
          title="Completion Rate"
          value={`${trainingStats.completionRate}%`}
          icon={CheckCircleIcon}
          color="indigo"
        />
      </div>

      {/* Course Management */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Training Courses</h3>
            <button
              onClick={() => setShowAddCourse(true)}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Course
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {courses.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              onSelect={() => setSelectedCourse(course)}
            />
          ))}
        </div>
      </div>

      {/* Employee Progress */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium">Employee Training Progress</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {employees.map((employee) => (
            <EmployeeProgressCard
              key={employee._id}
              employee={employee}
              courses={courses}
            />
          ))}
        </div>
      </div>

      {/* Add Course Modal */}
      {showAddCourse && (
        <AddCourseModal
          onClose={() => setShowAddCourse(false)}
          onSubmit={fetchTrainingData}
        />
      )}

      {/* Course Details Modal */}
      {selectedCourse && (
        <CourseDetailsModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
        />
      )}
    </div>
  );
};

const CourseCard = ({ course, onSelect }) => (
  <div className="border rounded-lg hover:shadow-md transition-shadow">
    <div className="p-4">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium">{course.title}</h4>
          <p className="text-sm text-gray-500 mt-1">{course.description}</p>
        </div>
        <span className={`px-2 py-1 text-xs rounded-full ${
          course.status === 'active'
            ? 'bg-green-100 text-green-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {course.status}
        </span>
      </div>
      <div className="mt-4">
        <div className="flex items-center text-sm text-gray-500">
          <ClockIcon className="h-4 w-4 mr-1" />
          {course.duration} hours
        </div>
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <UserGroupIcon className="h-4 w-4 mr-1" />
          {course.enrollments.length} enrolled
        </div>
      </div>
      <div className="mt-4">
        <button
          onClick={onSelect}
          className="text-indigo-600 text-sm hover:text-indigo-800"
        >
          View Details
        </button>
      </div>
    </div>
  </div>
);

const EmployeeProgressCard = ({ employee, courses }) => {
  const completedCourses = courses.filter(course =>
    course.completions.includes(employee._id)
  ).length;
  const totalCourses = courses.length;
  const progress = (completedCourses / totalCourses) * 100;

  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <img
            src={employee.avatar || '/default-avatar.png'}
            alt=""
            className="h-10 w-10 rounded-full"
          />
          <div className="ml-4">
            <h4 className="font-medium">{employee.name}</h4>
            <p className="text-sm text-gray-500">{employee.position}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium">
            {completedCourses}/{totalCourses} Courses
          </div>
          <div className="text-sm text-gray-500">
            {progress.toFixed(0)}% Complete
          </div>
        </div>
      </div>
      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-indigo-600 h-2 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

const calculateCompletionRate = (completed, total) => {
  return total === 0 ? 0 : (completed / total) * 100;
};

const AddCourseModal = ({ show, onClose, onSubmit }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      {/* Modal content */}
    </div>
  );
};

const CourseDetailsModal = ({ show, onClose, course }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      {/* Modal content */}
    </div>
  );
};

export default TrainingManagement; 