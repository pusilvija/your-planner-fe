import { useEffect, useState } from 'react';
import TaskColumn from './TaskColumn/TaskColumn.jsx';
import './TaskBoard.css';

function TaskBoard() {
  const [tasks, setTasks] = useState({
    'to do': [],
    'done': [],
    'in progress': []
  });

  useEffect(() => {
    fetch('/api/taskboard/')
      .then(res => res.json())
      .then(data => {
        console.log('Fetched tasks:', data); // log data to inspect
        setTasks(data); // Set grouped tasks directly from API response
      })
      .catch(console.error);
  }, []);

  const statuses = ['to do', 'in progress', 'done'];

  return (
    <div className="task-board">
      {statuses.map(status => (
        <TaskColumn
          key={status}
          status={status}
          tasks={tasks[status] || []} // Access tasks based on the status
        />
      ))}
    </div>
  );
}

export default TaskBoard;
