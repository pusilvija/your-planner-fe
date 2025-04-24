import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function TaskDetails() {
  const { taskId } = useParams(); // Get taskId from URL
  const [task, setTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [taskData, setTaskData] = useState({});

  useEffect(() => {
    // Fetch task details when component loads
    console.log("taskdetais useeffect")
    console.log("taskId:", taskId)
    fetch(`/api/tasks/${taskId}/`)
      .then(response => response.json())
      .then(data => {
        setTask(data);
        setTaskData(data); // Initialize task data for editing
      })
      .catch(console.error);
  }, [taskId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // Send PUT request to update task details
    fetch(`http://localhost:8000/api/tasks/${taskId}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    })
      .then((response) => response.json())
      .then((updatedTask) => {
        setTask(updatedTask);
        setIsEditing(false);
      })
      .catch(console.error);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  if (!task) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Task Details</h1>
      {isEditing ? (
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
      ) : (
        <div>
          <p><strong>Task Name:</strong> {task.name}</p>
          <p><strong>Description:</strong> {task.description}</p>
          <p><strong>Status:</strong> {task.status}</p>
          <button onClick={handleEdit}>Edit</button>
        </div>
      )}
      {isEditing && <button onClick={handleSave}>Save</button>}
    </div>
  );
}

export default TaskDetails;
