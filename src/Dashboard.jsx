import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown'; 
import { API_ENDPOINT } from './Api';

function Dashboard() {
    const [user, setUser] = useState(null); // State to store user data
    const navigate = useNavigate();

    // Verify if User is Logged In
    useEffect(() => {
        const token = localStorage.getItem('token');
        
        if (!token) {
            // If no token, reset user state and navigate to login
            setUser(null);
            navigate("/login");
            return;
        }

        try {
            const decoded_token = jwtDecode(token); // Decode the token
            console.log("Decoded Token:", decoded_token); // Check the decoded token structure

            if (decoded_token && decoded_token.username) {
                setUser(decoded_token); // Set the user data from token
            } else {
                // If decoded token is invalid, reset user state and redirect
                setUser(null);
                navigate("/login");
            }
        } catch (error) {
            console.error("Error decoding token", error);
            setUser(null); // Reset user state in case of error
            navigate("/login"); // Redirect to login if there's an error
        }
    }, [navigate]); // Ensure this runs every time `navigate` changes

    // Handle Logout
    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove token from localStorage
        setUser(null); // Reset user state on logout
        navigate("/login"); // Redirect to login page
    };

    return (
        <>
            <Navbar bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand href="#home" style={{ color: '#E50914' }}>NETFLEX</Navbar.Brand> {/* Netflix red color */}
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

            {/* Add more Dashboard content here */}
        </>
    );
}

export default Dashboard;
