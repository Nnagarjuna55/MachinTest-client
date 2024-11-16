import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '../../../config/config';
import {
  PlusIcon,
  ChevronDownIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

const ProjectsAndTasks = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [showAddProject, setShowAddProject] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjectsAndTasks = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [projectsRes, tasksRes] = await Promise.all([
        axios.get(`${API_URL}/api/projects`),
        axios.get(`${API_URL}/api/tasks`)
      ]);

      setProjects(projectsRes.data);
      setTasks(tasksRes.data);
    } catch (error) {
      console.error('Error fetching projects and tasks:', error);
      setError('Failed to fetch data');
      toast.error('Failed to fetch projects and tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjectsAndTasks();
  }, [fetchProjectsAndTasks]);

  return (
    <div className="space-y-6">
      {/* Projects Overview */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Projects</h2>
            <button
              onClick={() => setShowAddProject(true)}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              New Project
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                onSelect={() => setSelectedProject(project)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Tasks Overview */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Tasks</h2>
            <button
              onClick={() => setShowAddTask(true)}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              New Task
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onSelect={() => setSelectedProject(task.project)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProjectCard = ({ project, onSelect }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h3 className="text-lg font-medium">{project.title}</h3>
    <p className="text-sm text-gray-500 mt-1">{project.description}</p>
    <div className="mt-4 flex justify-between items-center">
      <span className="text-sm text-gray-500">
        {project.status}
      </span>
      <button className="text-indigo-600 text-sm hover:text-indigo-800">
        View Details
      </button>
    </div>
  </div>
);

const TaskCard = ({ task, onSelect }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h3 className="text-lg font-medium">{task.title}</h3>
    <p className="text-sm text-gray-500 mt-1">{task.description}</p>
    <div className="mt-4 flex justify-between items-center">
      <span className="text-sm text-gray-500">
        {task.status}
      </span>
      <button className="text-indigo-600 text-sm hover:text-indigo-800">
        View Details
      </button>
    </div>
  </div>
);

export default ProjectsAndTasks; 