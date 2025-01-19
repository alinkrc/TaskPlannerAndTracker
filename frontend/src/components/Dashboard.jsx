import React, { useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import api from '../api';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [username, setUsername] = useState('');
    const [searchId, setSearchId] = useState('');
    const [userRole, setUserRole] = useState(null); // Default to `null` instead of an empty string
    const [loadingRole, setLoadingRole] = useState(true); // State to track role loading
    const [loadingTasks, setLoadingTasks] = useState(false); // State to track task fetching
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserRoleAndTasks = async () => {
            try {
                const token = localStorage.getItem('token');
                const decodedToken = jwt_decode(token);
                console.log(decodedToken);
                setUserRole(decodedToken.role); // Set user role
                
                setUsername(decodedToken.username);
                console.log(username);
                setLoadingRole(false); // Mark role as loaded

                setLoadingTasks(true); // Start fetching tasks
                let response;
                if (decodedToken.role === 'manager') {
                    response = await api.get('/tasks');
                } else if (decodedToken.role === 'user') {
                    response = await api.get(`/tasks?assignedUserId=${decodedToken.id}`);
                }

                setTasks(response?.data || []); // Set tasks or empty array
            } catch (error) {
                console.error('Error fetching user role or tasks:', error);
            } finally {
                setLoadingTasks(false); // Stop task loading
            }
        };

        fetchUserRoleAndTasks();
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
    try {
      if (searchId === '') {
        // If searchId is empty, refetch the initial task list
        let response;
        if (userRole === 'manager') {
          response = await api.get('/tasks');
        } else if (userRole === 'user') {
          const token = localStorage.getItem('token');
          const decodedToken = jwt_decode(token);
          response = await api.get(`/tasks?assignedUserId=${decodedToken.id}`);
        }
        setTasks(response?.data ||'');
      } else {
        // Otherwise, search for the task with the given ID
        const response = await api.get(`/tasks/${searchId}`);
        setTasks([response.data]);
      }
    } catch (error) {
      console.error('Error fetching task:', error);
    }
  };

  const handleEdit = (taskId) => {
    // Use navigate to redirect to the edit page with the task ID
    navigate(`/tasks/${taskId}/edit`, { state: { userRole } }); // Pass userRole as state
  };


    const handleDelete = async (taskId) => {
        try {
          // Make API call to delete the task
          await api.delete(`/tasks/${taskId}`);
    
          // Update the task list
          setTasks(tasks.filter((task) => task.id !== taskId));
        } catch (error) {
          console.error("Error deleting task:", error);
          // ... (handle error, e.g., display error message)
        }
      };

    // Delay rendering until userRole is loaded
    if (loadingRole) {
        return <div>Loading user role...</div>;
    }

    // Render admin-specific content if userRole is 'admin'
    if (userRole === 'admin') {
        return (
            <div>
                <h2>Admin Dashboard</h2>
                <p>Welcome, Administrator!</p>
                
            </div>
        );
    }

    // Render tasks and search for 'manager' and 'user'
    return (
        <div>
            {loadingTasks ? (
                <div>Loading tasks...</div>
            ) : (
                <>
                    {userRole !== 'admin' && (
                        <>
                            <p>Welcome, {username}!</p>
                            <form onSubmit={handleSearch}>
                                <input
                                    type="text"
                                    placeholder="Enter Task ID"
                                    value={searchId}
                                    onChange={(e) => setSearchId(e.target.value)}
                                />
                                <button type="submit">Search</button>
                            </form>

                            <h2>Tasks</h2>
                            {tasks.length === 0 ? (
                                <p>No tasks found.</p>
                            ) : (
                                <ul>
                                    {tasks.map((task) => (
                                        <li key={task.id}>
                                            <Link to={`/tasks/${task.id}`}>
                                                {task.description} - {task.state}
                                            </Link>
                                            {userRole === 'manager' && task.managerId === jwt_decode(localStorage.getItem('token')).id && (
                                                <>
                                                    <button onClick={() => handleEdit(task.id)}>Edit</button>
                                                    <button onClick={() => handleDelete(task.id)}>Delete</button>
                                                </>
                                            )}

                                            {/* Edit button for simple users */}
                                                {userRole === 'user' && (
                                                    <>
                                                        <button onClick={() => handleEdit(task.id)}>Edit</button>
                                                    </>
                                                )}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default Dashboard;