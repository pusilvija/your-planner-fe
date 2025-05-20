import React, { useState } from 'react';
import useFetchTasks from './hooks/useFetchTasks';
import './TasksPage.css';
import { updateTask, deleteTask } from './services/taskService';

function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedField, setEditedField] = useState({});
  const [sortConfig, setSortConfig] = useState({ field: null, direction: 'asc' }); // Sorting state

  useFetchTasks(setTasks);

  const handleFieldClick = (taskId, fieldName, currentValue) => {
    setEditingTaskId(taskId);
    setEditedField({ fieldName, value: currentValue });
  };

  const handleInputChange = (e) => {
    setEditedField({ ...editedField, value: e.target.value });
  };

  const handleSave = async (taskId) => {
    try {
      const updatedTask = {
        ...tasks.find((task) => task.id === taskId),
        [editedField.fieldName]: editedField.value,
      };

      await updateTask(taskId, updatedTask);

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId
            ? { ...task, [editedField.fieldName]: editedField.value }
            : task
        )
      );
    } catch (error) {
      console.error('Failed to save task:', error);
    } finally {
      setEditingTaskId(null);
      setEditedField({});
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await deleteTask(taskId);

      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleSort = (field) => {
    let direction = 'asc';
    if (sortConfig.field === field && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ field, direction });

    setTasks((prevTasks) => {
      const sortedTasks = [...prevTasks].sort((a, b) => {
        if (a[field] < b[field]) return direction === 'asc' ? -1 : 1;
        if (a[field] > b[field]) return direction === 'asc' ? 1 : -1;
        return 0;
      });
      return sortedTasks;
    });
  };

  const renderSortIcon = (field) => {
    if (sortConfig.field === field) {
      return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
    }
    return ''; // No icon if not sorted
  };

  return (
    <div className="tasks-page">
      <h1>All Tasks</h1>
      <table className="tasks-table">
        <thead>
          <tr>
          <th onClick={() => handleSort('name')}>
              Task Name {renderSortIcon('name')}
            </th>
            <th>Description</th>
            <th onClick={() => handleSort('status')}>
              Status {renderSortIcon('status')}
            </th>
            <th onClick={() => handleSort('category')}>
              Category {renderSortIcon('category')}
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, index) => (
            <tr key={task.id || index}>
              <td>
                {editingTaskId === task.id && editedField.fieldName === 'name' ? (
                  <input
                    type="text"
                    value={editedField.value}
                    onChange={handleInputChange}
                    onBlur={() => handleSave(task.id)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSave(task.id)}
                    autoFocus
                  />
                ) : (
                  <span onClick={() => handleFieldClick(task.id, 'name', task.name)}>
                    {task.name}
                  </span>
                )}
              </td>
              <td>
                {editingTaskId === task.id && editedField.fieldName === 'description' ? (
                  <textarea
                    value={editedField.value}
                    onChange={handleInputChange}
                    onBlur={() => handleSave(task.id)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSave(task.id)}
                    autoFocus
                  />
                ) : (
                  <span onClick={() => handleFieldClick(task.id, 'description', task.description)}>
                    {task.description}
                  </span>
                )}
              </td>
              <td>
                {editingTaskId === task.id && editedField.fieldName === 'status' ? (
                  <select
                    value={editedField.value}
                    onChange={handleInputChange}
                    onBlur={() => handleSave(task.id)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSave(task.id)}
                    autoFocus
                  >
                    <option value="to do">to do</option>
                    <option value="in progress">in progress</option>
                    <option value="done">done</option>
                  </select>
                ) : (
                  <span onClick={() => handleFieldClick(task.id, 'status', task.status)}>
                    {task.status}
                  </span>
                )}
              </td>
              <td>
                {editingTaskId === task.id && editedField.fieldName === 'category' ? (
                  <input
                    type="text"
                    value={editedField.value}
                    onChange={handleInputChange}
                    onBlur={() => handleSave(task.id)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSave(task.id)}
                    autoFocus
                  />
                ) : (
                  <span onClick={() => handleFieldClick(task.id, 'category', task.category)}>
                    {task.category}
                  </span>
                )}
              </td>
              <td>
                <button className="delete-button" onClick={() => handleDelete(task.id)}></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TasksPage;
