// ViewUsers.jsx
import React, { useState, useEffect } from 'react';
import api from '../api';

const ViewUsers = () => {
  const [users, setUsers] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  },);

  if (loading) {
    return <div>Loading users...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>
          {user.username} - {user.role}
          {/* You can add more user details or actions here */}
        </li>
      ))}
    </ul>
  );
};

export default ViewUsers;