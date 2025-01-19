import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const CreateUser = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'user',
    managerId: null,
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
      await api.post('/users', formData);
      navigate('/users');
    } catch (error) {
      console.error('Error creating user:', error);
      setError('Failed to create user');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="role">Role:</label>
        <select id="role" name="role" value={formData.role} onChange={handleChange}>
          <option value="user">User</option>
          <option value="manager">Manager</option>
        </select>
      </div>
      {/* Conditionally render managerId field */}
      {formData.role === 'user' && (
        <div>
          <label htmlFor="managerId">Manager ID:</label>
          <input
            type="number"
            id="managerId"
            name="managerId"
            value={formData.managerId || ''}
            onChange={handleChange}
          />
        </div>
      )}
      <button type="submit">Create User</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default CreateUser;