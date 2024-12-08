import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.css";
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { API_ENDPOINT } from './Api';

function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loggedInUser, setLoggedInUser] = useState(null); // To display logged in user

    // Check if the user is already logged in (token exists)
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const tokenData = JSON.parse(token);
            setLoggedInUser(tokenData.user); // Set logged in user based on token data
            navigate("/dashboard"); // If token exists, navigate to dashboard
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const response = await axios.post(`${API_ENDPOINT}/auth/login`, {
                username,
                password,
            });
    
            if (response.data.token) {
                // Clear any previous token before saving new one
                localStorage.removeItem('token'); // Ensures no old data is used
    
                // Save the new token to localStorage
                const token = {
                    jwt: response.data.token,  // The JWT token returned from backend
                    user: username,             // Store username as part of the token info
                };
                localStorage.setItem("token", JSON.stringify(token)); // Store as string
    
                setError(''); // Clear any previous errors
                navigate("/dashboard"); // Redirect to the dashboard page after successful login
            } else {
                setError('Login failed. Please check your credentials.');
            }
        } catch (err) {
            if (err.response && err.response.status === 404) {
                setError('Username not found');
            } else if (err.response && err.response.status === 401) {
                setError('Incorrect password');
            } else {
                setError('Invalid username or password.');
            }
            console.error('Login error:', err); // Log the error for debugging
        }
    };
    

    return (
        <div style={{ 
            backgroundColor: '#000', // Netflix black background
            height: '100vh', 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            color: '#FFF', // Default text color white for readability
        }}>
            {/* Netflix-themed Navbar */}
            <Navbar bg="dark" variant="dark" style={{ position: 'absolute', top: 0, width: '100%' }}>
                <Container>
                    <Navbar.Brand href="#home" style={{
                        fontWeight: 'bold',
                        color: '#E50914', // Netflix red
                        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                        fontSize: '1.5rem'
                    }}>
                        NETFLEX
                    </Navbar.Brand>
                    {/* Display Logged-in User in Navbar */}
                    <div style={{ color: '#FFF', fontWeight: 'bold' }}>
                        {loggedInUser && `User: ${loggedInUser}`}
                    </div>
                </Container>
            </Navbar>

            {/* Logo */}
            <center>
                <img
                    src="/img/log.png" // Replace with your actual image path
                    alt="NETFLEX"
                    style={{ 
                        width: '100px', // Reduced width
                        height: '100px', // Reduced height
                        marginTop: '80px', // Fine-tuned top margin
                        marginBottom: '20px', // Slightly reduced bottom margin
                    }}
                />
            </center>

            {/* Login Form */}
            <Container>
                <Row className="justify-content-md-center">
                    <Col md={5}>
                        <div className="login-form">
                            <div className="container text-center">
                                <div className="card" style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Transparent background
                                    borderRadius: '10px',
                                    padding: '20px',
                                    border: '2px solid #FFF', // White border
                                    marginTop: '10px' // Adjusted margin to move the form higher
                                }}>
                                    <h2 style={{
                                        color: '#FFF',
                                        fontWeight: 'bold',
                                        marginBottom: '20px'
                                    }}>
                                        LOGIN
                                    </h2>

                                    <div className="card-body">
                                        <Form onSubmit={handleSubmit}>
                                            <Form.Group controlId="formUsername">
                                                <Form.Label style={{ color: '#FFF' }}>Username:</Form.Label>
                                                <Form.Control
                                                    className='form-control-sm rounded-0'
                                                    type="text"
                                                    placeholder="Enter Username"
                                                    value={username}
                                                    onChange={(e) => setUsername(e.target.value)} required
                                                />
                                            </Form.Group>
                                            <br />

                                            <Form.Group controlId="formPassword">
                                                <Form.Label style={{ color: '#FFF' }}>Password:</Form.Label>
                                                <Form.Control
                                                    className='form-control-sm rounded-0'
                                                    type="password"
                                                    placeholder="Enter Password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)} required
                                                />
                                            </Form.Group>

                                            <div style={{ marginTop: '10px', marginBottom: '20px' }}>
                                                <p style={{ fontSize: '0.9rem', color: '#FFF' }}>
                                                    Don't have an account?{' '}
                                                    <a 
                                                        href="/register" 
                                                        style={{ color: '#E50914', textDecoration: 'none' }}
                                                    >
                                                        Register here
                                                    </a>
                                                </p>
                                            </div>

                                            <Form.Group controlId="formButton">
                                                {error && <p style={{ color: 'red' }}>{error}</p>}
                                                <Button
                                                    variant='danger'
                                                    className="btn btn-block bg-custom btn-flat rounded-0"
                                                    size="sm"
                                                    type="submit"
                                                    style={{ width: '100%' }}
                                                >
                                                    Login Now
                                                </Button>
                                            </Form.Group>
                                        </Form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Login;
