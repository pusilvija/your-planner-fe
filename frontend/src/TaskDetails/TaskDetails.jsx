import './TaskDetails.css';
import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

function TaskDetails() {
  const { taskId } = useParams(); // Get taskId from URL
  const navigate = useNavigate();
  const location = useLocation(); // Use useLocation hook to get the current location
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
      fetch(`/api/tasks/${taskId}/`)
        .then((response) => response.json())
        .then((data) => {
          setTask(data);
          setTaskData(data);
        })
        .catch(console.error);
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
      // Create a new task
      fetch('/api/tasks/add-new-task/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to create task');
          }
          return response.json();
        })
        .then((newTask) => {
          console.log('Task created successfully:', newTask);
          navigate('/'); // Navigate back to the task board
        })
        .catch((error) => {
          console.error('Error creating task:', error);
        });
    } else {
      // Update an existing task
      fetch(`/api/tasks/${taskId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to update task');
          }
          return response.json();
        })
        .then((updatedTask) => {
          console.log('Task updated successfully:', updatedTask);
          navigate('/'); // Navigate back to the task board
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