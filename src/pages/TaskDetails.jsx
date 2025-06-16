import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

import { fetchTaskDetails, createTask, updateTask, deleteTask } from '../services/taskService';

import './TaskDetails.css';


function TaskDetails() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialStatus = queryParams.get('status') || 'to do';

  const [taskData, setTaskData] = useState({
    name: '',
    description: '',
    status: initialStatus,
    category: '',
  });

  const [initialTaskData, setInitialTaskData] = useState(null); // Store the initial data
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unsavedChanges, setUnsavedChanges] = useState(false); // Track unsaved changes


  // Fetch task details if editing an existing task
  useEffect(() => {
    if (taskId !== 'new') {
      setLoading(true);
      fetchTaskDetails(taskId)
        .then((response) => {
          setTaskData(response.data);
          setInitialTaskData(response.data);
        })
        .catch((error) => {
          console.error('Error fetching task details:', error);
          setError('Failed to fetch task details.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [taskId]);
  
  // For new tasks, use the default state as initial data
  useEffect(() => {
    if (taskId === 'new') {
      setInitialTaskData(taskData);
    }
  }, [taskId, taskData]);


  // Detect unsaved changes
  useEffect(() => {
    if (JSON.stringify(taskData) !== JSON.stringify(initialTaskData)) {
      setUnsavedChanges(true);
    } else {
      setUnsavedChanges(false);
    }
  }, [taskData, initialTaskData]);

  // Warn user before leaving the page
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (unsavedChanges) {
        e.preventDefault();
        e.returnValue = ''; // Required for modern browsers
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [unsavedChanges]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setLoading(true);
      try {
        await deleteTask(taskId); // Call the deleteTask function
        console.log('Task deleted successfully.');
        navigate('/taskboard'); // Navigate back to the task board
      } catch (error) {
        console.error('Error deleting task:', error);
        setError('Failed to delete task. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (taskId === 'new') {
        await createTask(taskData);
        console.log('Task created successfully.');
      } else {
        await updateTask(taskId, taskData);
        console.log('Task updated successfully.');
      }
      setUnsavedChanges(false);
      navigate(-1);
    } catch (error) {
      console.error('Error saving task:', error);
      setError('Failed to save task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div>
      <h1>{taskId === 'new' ? 'Create Task' : 'Edit Task'}</h1>
      <table>
        <tbody>
          <tr>
            <td>Task Name:</td>
            <td>
              <input
                type="text"
                name="name"
                value={taskData.name || ''}
                onChange={handleChange}
              />
            </td>
          </tr>
          <tr>
            <td>Description:</td>
            <td>
            <textarea
              name="description"
              value={taskData.description || ''}
              onChange={handleChange}
            />
            </td>
          </tr>
          <tr>
            <td>Status:</td>
            <td>
              <select
                name="status"
                value={taskData.status || ''}
                onChange={handleChange}
              >
                <option value="to do">To Do</option>
                <option value="in progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </td>
          </tr>
          <tr>
            <td>Category:</td>
            <td>
              <input
                name="category"
                value={taskData.category || ''}
                onChange={handleChange}
              >
              </input>
            </td>
          </tr>
          
        </tbody>
      </table>
      <button className="taskdetails-buttons" id="save-button" onClick={handleSave}>
        Save
      </button>
      <button
        className="taskdetails-buttons"
        id="back-button"
        onClick={() => {
          if (unsavedChanges && !window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
            return;
          }
          navigate(-1);
        }}
      >
        Back
      </button>
      <button className="taskdetails-buttons" id="delete-button" onClick={handleDelete}>
        Delete
      </button>
    </div>
  );
}

export default TaskDetails;
