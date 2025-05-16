import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

import axiosInstance from '../axiosConfig';

import './TaskDetails.css';


function TaskDetails() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialStatus = queryParams.get('status') || 'to do';

  const [task, setTask] = useState(null);
  const [taskData, setTaskData] = useState({
    name: '',
    description: '',
    status: initialStatus,
    category: '',
  });

  useEffect(() => {
    if (taskId !== 'new') {
      // Fetch task details when editing an existing task
      axiosInstance.get(`/tasks/${taskId}/`)
        .then((response) => {
          setTask(response.data);
          setTaskData(response.data);
        })
        .catch((error) => {
          console.error('Error fetching task details:', error);
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

  const handleSave = () => {
    if (taskId === 'new') {
      axiosInstance.post('/tasks/add-new-task/', taskData)
        .then((response) => {
          console.log('Task created successfully:', response.data);
          navigate('/taskboard');
        })
        .catch((error) => {
          console.error('Error creating task:', error);
        });
    } else {
      // Update an existing task
      axiosInstance.patch(`/tasks/${taskId}/`, taskData)
        .then((response) => {
          console.log('Task updated successfully:', response.data);
          navigate('/taskboard');
        })
        .catch((error) => {
          console.error('Error updating task:', error);
        });
    }
  };

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
      <button className="taskdetails-buttons" id="save-button" onClick={handleSave}>Save</button>
      <button className="taskdetails-buttons" id="back-button" onClick={() => window.history.back()}>Back</button>
    </div>
  );
}

export default TaskDetails;
