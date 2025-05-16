import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

import { fetchTaskDetails, createTask, updateTask } from '../services/taskService';

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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch task details if editing an existing task
  useEffect(() => {
    if (taskId !== 'new') {
      setLoading(true);
      fetchTaskDetails(taskId)
        .then((response) => {
          setTaskData(response.data);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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
      navigate('/taskboard');
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
        </tbody>
      </table>
      <button className="taskdetails-buttons" id="save-button" onClick={handleSave}>
        Save
      </button>
      <button className="taskdetails-buttons" id="back-button" onClick={() => navigate(-1)}>
        Back
      </button>
    </div>
  );
}

export default TaskDetails;
