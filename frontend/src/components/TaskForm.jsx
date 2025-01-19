// TaskForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const TaskForm = () => {
  const [formData, setFormData] = useState({
    description: '',
    assignedUserId: '', // Use a text input for assignedUserId
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // Convert assignedUserId to a number before sending the request
      const numericAssignedUserId = parseInt(formData.assignedUserId, 10) || null; // Handle empty input
      await api.post('/tasks', { ...formData, assignedUserId: numericAssignedUserId });
      navigate('/');
    } catch (error) {
      console.error('Error creating task:', error);
      setError('Failed to create task');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="description">Description:</label>
        <input
          type="text"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="assignedUserId">Assigned User ID:</label>
        <input
          type="text" // Use a text input for assignedUserId
          id="assignedUserId"
          name="assignedUserId"
          value={formData.assignedUserId}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Create Task</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default TaskForm;