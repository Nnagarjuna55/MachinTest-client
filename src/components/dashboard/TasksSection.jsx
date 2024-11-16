import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  PlusIcon,
  ChevronDownIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

const API_URL = 'http://localhost:5000';

// Move DUMMY_PROJECTS outside component
const DUMMY_PROJECTS = [
  { _id: '1', name: 'Website Development' },
  { _id: '2', name: 'Mobile App' },
  { _id: '3', name: 'Database Migration' },
  { _id: '4', name: 'UI/UX Design' }
];

const TasksSection = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState(DUMMY_PROJECTS);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  // Update the fetchData function to only fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        toast.error('Authentication required');
        return;
      }

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      try {
        const tasksRes = await axios.get(`${API_URL}/api/tasks/employee/${userId}`, config);
        setTasks(tasksRes.data || []);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setTasks([]);
        toast.error('Failed to fetch tasks');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTasks();
  }, []);

  // Update the handleSubmit function in NewTaskModal
  const handleCreateTask = async (taskData) => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (!token || !userId) {
      toast.error('Authentication required');
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/api/tasks`,
        { ...taskData, employeeId: userId },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setTasks([...tasks, response.data]);
      setShowNewTaskModal(false);
      toast.success('Task created successfully');
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
    }
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const projectMatch = selectedProject === 'all' || task.projectId === selectedProject;
    const statusMatch = selectedStatus === 'all' || task.status === selectedStatus;
    return projectMatch && statusMatch;
  });

  // Update task status
  const handleStatusUpdate = async (taskId, newStatus) => {
    const token = localStorage.getItem('token');
    
    try {
      await axios.patch(
        `${API_URL}/api/tasks/${taskId}`, 
        { status: newStatus },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setTasks(tasks.map(task =>
        task._id === taskId ? { ...task, status: newStatus } : task
      ));
      toast.success('Task status updated');
    } catch (error) {
      toast.error('Failed to update task status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Tasks Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Tasks & Projects</h2>
          <button
            onClick={() => setShowNewTaskModal(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-indigo-700"
          >
            <PlusIcon className="h-5 w-5" />
            <span>New Task</span>
          </button>
        </div>

        {/* Filters */}
        <div className="mt-4 flex space-x-4">
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="rounded-md border-gray-300"
          >
            <option value="all">All Projects</option>
            {projects.map(project => (
              <option key={project._id} value={project._id}>
                {project.name}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-md border-gray-300"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Tasks List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          {isLoading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-2 text-gray-500">Loading tasks...</p>
            </div>
          ) : filteredTasks.length > 0 ? (
            <div className="space-y-4">
              {filteredTasks.map(task => (
                <TaskCard
                  key={task._id}
                  task={task}
                  project={projects.find(p => p._id === task.projectId)}
                  onStatusUpdate={handleStatusUpdate}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No tasks found</p>
              <button
                onClick={() => setShowNewTaskModal(true)}
                className="mt-4 text-indigo-600 hover:text-indigo-500"
              >
                Create your first task
              </button>
            </div>
          )}
        </div>
      </div>

      {/* New Task Modal */}
      {showNewTaskModal && (
        <NewTaskModal
          projects={projects}
          onClose={() => setShowNewTaskModal(false)}
          onSubmit={handleCreateTask}
        />
      )}
    </div>
  );
};

const TaskCard = ({ task, project, onStatusUpdate }) => (
  <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="font-medium">{task.title}</h3>
        <p className="text-sm text-gray-500">{project?.name}</p>
      </div>
      <select
        value={task.status}
        onChange={(e) => onStatusUpdate(task._id, e.target.value)}
        className={`rounded-full px-3 py-1 text-sm
          ${task.status === 'completed' ? 'bg-green-100 text-green-800' :
            task.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'}`}
      >
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
    </div>
    <p className="mt-2 text-sm text-gray-600">{task.description}</p>
    <div className="mt-4 flex justify-between items-center">
      <div className="flex items-center space-x-4 text-sm text-gray-500">
        <span className="flex items-center">
          <ClockIcon className="h-4 w-4 mr-1" />
          {new Date(task.dueDate).toLocaleDateString()}
        </span>
        <span className="flex items-center">
          <UserCircleIcon className="h-4 w-4 mr-1" />
          {task.assignedTo}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        {task.priority === 'high' && (
          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
            High Priority
          </span>
        )}
      </div>
    </div>
  </div>
);

const NewTaskModal = ({ projects, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectId: projects[0]?._id || '',
    dueDate: new Date().toISOString().split('T')[0],
    priority: 'normal',
  });

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Create New Task</h2>
        <form onSubmit={(e) => {
          e.preventDefault();
          onSubmit(formData);
        }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300"
              rows="3"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Project</label>
            <select
              value={formData.projectId}
              onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300"
              required
            >
              {projects.map(project => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Due Date</label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300"
              required
            >
              <option value="normal">Normal</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TasksSection; 