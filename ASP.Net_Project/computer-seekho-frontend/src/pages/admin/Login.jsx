import React, { useState, useContext } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { GoogleLogin } from '@react-oauth/google';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/signIn', { username, password });

            // Check all case variations
            let token = response.headers['authorization'] ||
                response.headers['Authorization'];

            if (token) {
                if (token.startsWith('Bearer ')) {
                    token = token.substring(7);
                }
                login({ username, token });
            } else {
                console.error("No token in headers:", response.headers);
                setError('Login succeeded but token missing. Check Console.');
            }
        } catch (err) {
            console.error(err);
            setError('Invalid username or password');
        }
    };

    return (
        <Container className="mt-5 d-flex justify-content-center">
            <Card style={{ width: '400px' }} className="shadow">
                <Card.Header className="bg-primary text-white text-center">
                    <h4>Admin Login</h4>
                </Card.Header>
                <Card.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="w-100 mb-3">
                            Login
                        </Button>
                        <div className="d-flex justify-content-center">
                            <GoogleLogin
                                onSuccess={async (credentialResponse) => {
                                    try {
                                        const response = await api.post('/auth/google-login', {
                                            token: credentialResponse.credential
                                        });
                                        let token = response.headers['authorization'];
                                        if (token) {
                                            if (token.startsWith('Bearer ')) token = token.substring(7);
                                            // Extract username from backend response
                                            const username = response.data?.username || "Google User";
                                            login({ username, token });
                                        }
                                    } catch (err) {
                                        setError('Google Login Failed. Ensure email is registered as Staff.');
                                    }
                                }}
                                onError={() => setError('Google Login Failed')}
                            />
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Login;
