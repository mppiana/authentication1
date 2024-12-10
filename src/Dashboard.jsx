import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Navbar, Container, Nav, NavDropdown, Button, Form, Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { API_ENDPOINT } from './Api';

function Dashboard() {
  const [user, setUser] = useState(null); // State to store user data
  const [users, setUsers] = useState([]); // State to store users list
  const [selectedUser, setSelectedUser] = useState(null); // State for selected user
  const [showCreateModal, setShowCreateModal] = useState(false); // State for Create User Modal
  const [showDetailsModal, setShowDetailsModal] = useState(false); // State for Details Modal
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState({});
  const navigate = useNavigate();

  const token = localStorage.getItem('token'); // Get token directly from localStorage

  // Verify if User is Logged In and fetch user data from token
  useEffect(() => {
    if (!token) {
      navigate("/login"); // Redirect to login if no token
      return;
    }

    try {
      const decodedToken = jwtDecode(token); // Decode the token
      if (decodedToken?.username) {
        setUser(decodedToken); // Set user data from token
      } else {
        setUser(null); // If invalid token, redirect to login
        navigate("/login");
      }
    } catch (error) {
      console.error("Error decoding token", error);
      setUser(null); // Reset user state in case of error
      navigate("/login"); // Redirect to login if error
    }
  }, [token, navigate]);

  // Fetch Users
  useEffect(() => {
    if (token) {
      fetchUsers(); // Fetch users only if token exists
    }
  }, [token]);

  const fetchUsers = async () => {
    try {
      const headers = {
        accept: 'application/json',
        Authorization: `Bearer ${token}`, // Ensure token is prefixed with "Bearer"
      };

      const response = await axios.get('https://adet2a-0tf2.onrender.com/api/user', { headers });
      setUsers(response.data); // Update state with the fetched data
    } catch (error) {
      if (error.response) {
        Swal.fire({
          text: error.response.data.message || "An error occurred while fetching users.",
          icon: "error"
        });
      } else if (error.request) {
        Swal.fire({
          text: "Network error. Please try again later.",
          icon: "error"
        });
      } else {
        Swal.fire({
          text: "An error occurred. Please try again.",
          icon: "error"
        });
      }
    }
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    setUser(null); // Reset user state on logout
    navigate("/login"); // Redirect to login page
  };

  // Create User
  const createUser = async (e) => {
    e.preventDefault();

    const formData = {
      fullname,
      username,
      password,
    };

    const headers = {
      accept: 'application/json',
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await axios.post(`${API_ENDPOINT}/user`, formData, { headers });
      Swal.fire({
        icon: "success",
        text: response.data.message
      });

      fetchUsers(); // Refresh users list after creation
      setShowCreateModal(false); // Close modal after success
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setValidationError(error.response.data.errors);
      } else {
        Swal.fire({
          text: error.response?.data.message || "An error occurred while creating the user.",
          icon: "error"
        });
      }
    }
  };

  // Delete User
  const deleteUser = async (userId) => {
    try {
      const headers = {
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.delete(`${API_ENDPOINT}/user/${userId}`, { headers });
      Swal.fire({
        icon: "success",
        text: response.data.message
      });

      fetchUsers(); // Refresh users list after deletion
    } catch (error) {
      Swal.fire({
        text: error.response?.data.message || "An error occurred while deleting the user.",
        icon: "error"
      });
    }
  };

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#home" style={{ color: '#E50914' }}>NETFLEX</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="#home" style={{ color: '#fff' }}>Home</Nav.Link>
            <Nav.Link href="#series" style={{ color: '#fff' }}>Series</Nav.Link>
            <Nav.Link href="#movies" style={{ color: '#fff' }}>Movies</Nav.Link>
          </Nav>

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <NavDropdown title={user ? `User: ${user.username}` : 'Loading...'} id="basic-nav-dropdown" align="end">
                <NavDropdown.Item href="#">Profile</NavDropdown.Item>
                <NavDropdown.Item href="#">Settings</NavDropdown.Item>
                <NavDropdown.Item href="#" onClick={handleLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="container mt-4">
        <Button className="mb-3" onClick={() => setShowCreateModal(true)}>
          Create User
        </Button>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Fullname</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users && users.length > 0 ? (
              users.map((user) => (
                <tr key={user.user_id}>
                  <td>{user.user_id}</td>
                  <td>{user.username}</td>
                  <td>{user.fullname}</td>
                  <td>
                    <Button size="sm" onClick={() => { setSelectedUser(user); setShowDetailsModal(true); }}>View</Button>
                    <Button size="sm" variant="danger" onClick={() => deleteUser(user.user_id)}>Delete</Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">No users available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create User Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={createUser}>
            <Form.Group>
              <Form.Label>Fullname</Form.Label>
              <Form.Control type="text" value={fullname} onChange={(e) => setFullname(e.target.value)} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </Form.Group>
            <Button type="submit" className="mt-3">Save</Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* User Details Modal */}
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser ? (
            <>
              <p><strong>ID:</strong> {selectedUser.user_id}</p>
              <p><strong>Username:</strong> {selectedUser.username}</p>
              <p><strong>Fullname:</strong> {selectedUser.fullname}</p>
            </>
          ) : <p>No user selected</p>}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Dashboard;
