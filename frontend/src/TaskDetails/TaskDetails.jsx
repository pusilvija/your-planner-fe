import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './TaskDetails.css';


function TaskDetails() {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8000/api/tasks/${taskId}/`) // Adjust backend API if needed
      .then(res => res.json())
      .then(data => setTask(data))
      .catch(console.error);
  }, [taskId]);

  if (!task) {
    return <div>Loading task...</div>;
  }

  return (
    <div>
      <h1>{task.name}</h1>
      <p>Status: {task.status}</p>
      <p>Description: {task.description}</p>
      {/* Add more fields if your task has them */}
    </div>
  );
}

export default TaskDetails;
