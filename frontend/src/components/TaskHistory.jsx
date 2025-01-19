import React, { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import api from "../api";

const TaskHistory = () => {
  const [tasks, setTasks] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(""); // State for the user ID input
  const [noTasksFound, setNoTasksFound] = useState(false); // State to track if no tasks were found

  useEffect(() => {
    const fetchTaskHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const decodedToken = jwt_decode(token);
        setUserRole(decodedToken.role);

        const response = await api.get(`/tasks/history/${decodedToken.id}`);
        setTasks(response?.data || []);
      } catch (error) {
        console.error("Error fetching task history:", error);
        setError("Failed to fetch task history.");
      } finally {
        setLoading(false);
      }
    };

    fetchTaskHistory();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await api.get(`/tasks/history/${userId}`);
      const fetchedTasks = response?.data || [];
      setTasks(fetchedTasks);
      setNoTasksFound(fetchedTasks.length === 0);
      setError(null); // Clear previous error
    } catch (error) {
      console.error("Error fetching task history:", error);
      setError("Failed to fetch task history.");
    }
  };

  if (loading) {
    return <div>Loading task history...</div>;
  }

  return (
    <div>
      <h2>Task History</h2>

      {/* Search form is always displayed for managers */}
      {userRole === "manager" && (
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Enter User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      )}

      {/* Display errors */}
      {error && <div className="error">{error}</div>}

      {/* Show "no tasks found" message */}
      {noTasksFound && <p>No tasks found for the specified user.</p>}

      {/* Display task list */}
      {Array.isArray(tasks) && tasks.length > 0 && (
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              {task.description} - {task.state}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskHistory;
