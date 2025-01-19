import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import api from '../api';

const TaskEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { userRole } = location.state || { userRole: null }; // Get userRole from props
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    description: '',
    assignedUserId: null,
    state: '',
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await api.get(`/tasks/${id}`);
        setTask(response.data);
        setFormData({
          description: response.data.description,
          assignedUserId: response.data.assignedUserId,
          state: response.data.state,
        });
      } catch (error) {
        console.error('Error fetching task:', error);
        setError('Failed to fetch task');
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'assignedUserId' ? parseInt(value, 10) || null : value, // Ensure assignedUserId is a number or null
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      
      await api.put(`/tasks/${id}`, formData);
      navigate(-1); // Go back to the previous page after updating
    } catch (error) {
      console.error('Error updating task:', error);
      setError('Failed to update task');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return <div>Loading task...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

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
      {/* Only show assignedUserId field for managers */}
      {userRole === 'manager' && (
        <div>
          <label htmlFor="assignedUserId">Assigned User ID:</label>
          <input
            type="number" // Use type="number" for numeric input
            id="assignedUserId"
            name="assignedUserId"
            value={formData.assignedUserId || ''} // Ensure a valid value for the input field
            onChange={handleChange}
          />
        </div>
      )}
      <div>
        <label htmlFor="state">State:</label>
        <select id="state" name="state" value={formData.state} onChange={handleChange}>
          <option value="OPEN">OPEN</option>
          <option value="PENDING">PENDING</option>
          <option value="COMPLETED">COMPLETED</option>
          {/* Only allow managers to set the state to CLOSED */}
          {userRole === 'manager' && <option value="CLOSED">CLOSED</option>}
        </select>
      </div>
      {isLoading ? (
        <button type="submit" disabled>Updating...</button>
      ) : (
        <button type="submit">Update Task</button>
      )}
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default TaskEdit;