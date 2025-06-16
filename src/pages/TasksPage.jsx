import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetchTasks } from '../hooks';
import './TasksPage.css';
import { updateTask, deleteTask } from '../services';

function TasksPage() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('');
  const [filterField, setFilterField] = useState('name'); // State for selected filter field
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedField, setEditedField] = useState({});
  const [sortConfig, setSortConfig] = useState({
    field: null,
    direction: 'asc',
  });

  useFetchTasks(setTasks);

  const handleFilterChange = (e) => {
    setFilter(e.target.value.toLowerCase());
  };

  const handleFilterFieldChange = (e) => {
    setFilterField(e.target.value); // Update the selected filter field
  };

  const filteredTasks = tasks.filter(
    (task) => task[filterField]?.toLowerCase().includes(filter) // Filter by the selected field
  );

  const handleAddTask = () => {
    const status = 'to do'; // Default status for new tasks
    navigate(`/tasks/new?status=${status}`);
  };

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

  const confirmAndDelete = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      handleDelete(taskId);
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

  const handleOpen = (taskId) => {
    window.location.href = `/tasks/${taskId}`;
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

      <div className="filter-container">
        {/* Filter Field Dropdown */}
        <select
          value={filterField}
          onChange={handleFilterFieldChange}
          className="filter-field-select"
        >
          <option value="name">Name</option>
          <option value="status">Status</option>
          <option value="category">Category</option>
        </select>

        {/* Filter Input */}
        <input
          type="text"
          placeholder={`Filter tasks by ${filterField}`}
          value={filter}
          onChange={handleFilterChange}
          className="filter-input"
        />
        <button className="add-task-btn" onClick={handleAddTask}></button>
      </div>

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
          {filteredTasks.map((task, index) => (
            <tr key={task.id || index}>
              <td>
                {editingTaskId === task.id &&
                editedField.fieldName === 'name' ? (
                  <input
                    type="text"
                    value={editedField.value}
                    onChange={handleInputChange}
                    onBlur={() => handleSave(task.id)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSave(task.id)}
                    autoFocus
                  />
                ) : (
                  <span
                    onClick={() => handleFieldClick(task.id, 'name', task.name)}
                  >
                    {task.name}
                  </span>
                )}
              </td>
              <td>
                {editingTaskId === task.id &&
                editedField.fieldName === 'description' ? (
                  <textarea
                    value={editedField.value}
                    onChange={handleInputChange}
                    onBlur={() => handleSave(task.id)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSave(task.id)}
                    autoFocus
                  />
                ) : (
                  <span
                    onClick={() =>
                      handleFieldClick(task.id, 'description', task.description)
                    }
                  >
                    {task.description}
                  </span>
                )}
              </td>
              <td>
                {editingTaskId === task.id &&
                editedField.fieldName === 'status' ? (
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
                  <span
                    onClick={() =>
                      handleFieldClick(task.id, 'status', task.status)
                    }
                  >
                    {task.status}
                  </span>
                )}
              </td>
              <td>
                {editingTaskId === task.id &&
                editedField.fieldName === 'category' ? (
                  <input
                    type="text"
                    value={editedField.value}
                    onChange={handleInputChange}
                    onBlur={() => handleSave(task.id)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSave(task.id)}
                    autoFocus
                  />
                ) : (
                  <span
                    onClick={() =>
                      handleFieldClick(task.id, 'category', task.category)
                    }
                  >
                    {task.category}
                  </span>
                )}
              </td>
              <td>
                <button
                  className="delete-button"
                  onClick={() => confirmAndDelete(task.id)}
                ></button>
                <button
                  className="open-button"
                  onClick={() => handleOpen(task.id)}
                ></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TasksPage;
