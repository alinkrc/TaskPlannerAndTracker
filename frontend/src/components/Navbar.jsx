import React, { useState, useEffect } from 'react';
import { Link , useNavigate} from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';

const MyNavbar = () => {
  const [userRole, setUserRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log(token);
    if (token) {
      const decodedToken = jwt_decode(token);
      setUserRole(decodedToken.role);
      setIsAuthenticated(true);
      
    } else {
        setUserRole(null);
        setIsAuthenticated(false);
    }
  }, );

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false); // Update authentication status
    navigate('/login'); // Redirect to login using navigate
  };

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="#home">Task Tracker</Navbar.Brand> {/* Replace with your app name */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {isAuthenticated && userRole === 'admin' && (
              <>
                <Nav.Link as={Link} to="/users/create">Create User</Nav.Link>
                <Nav.Link as={Link} to="/users">View Users</Nav.Link>
              </>
            )}
            {isAuthenticated && (userRole === 'manager' || userRole === 'user') && (
              <>
                <Nav.Link as={Link} to="/">Home</Nav.Link>
               
                <Nav.Link as={Link} to="/history">Task History</Nav.Link>
              </>
            )}
            {isAuthenticated && userRole === 'manager' && (
                 <Nav.Link as={Link} to="/tasks/new">Create Task</Nav.Link>
            )}
            {isAuthenticated && ( // Only show logout button if authenticated
            <Button variant="outline-danger" onClick={handleLogout}>
              Log Out
            </Button>
          )}

          </Nav>
          {/* You can add user info and logout button here */}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MyNavbar;