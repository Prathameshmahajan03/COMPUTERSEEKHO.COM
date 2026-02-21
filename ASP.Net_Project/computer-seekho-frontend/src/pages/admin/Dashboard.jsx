import React, { useContext } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Admin Dashboard</h2>
                <div>
                    <span className="me-3">Welcome, {user?.username}</span>
                    <Button variant="outline-danger" onClick={logout}>Logout</Button>
                </div>
            </div>

            <Row>
                <Col md={4} className="mb-4">
                    <Card className="text-center shadow-sm h-100">
                        <Card.Body>
                            <Card.Title>Enquiries</Card.Title>
                            <Card.Text>Manage new and existing enquiries.</Card.Text>
                            <Button as={Link} to="/admin/enquiries" variant="primary">Go to Enquiries</Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} className="mb-4">
                    <Card className="text-center shadow-sm h-100">
                        <Card.Body>
                            <Card.Title>Follow-ups</Card.Title>
                            <Card.Text>Check pending follow-ups for today.</Card.Text>
                            <Button as={Link} to="/admin/followups" variant="warning">View Follow-ups</Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} className="mb-4">
                    <Card className="text-center shadow-sm h-100">
                        <Card.Body>
                            <Card.Title>Student Registration</Card.Title>
                            <Card.Text>Register new students.</Card.Text>
                            <Button as={Link} to="/admin/register-student" variant="success">Register Student</Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} className="mb-4">
                    <Card className="text-center shadow-sm h-100">
                        <Card.Body>
                            <Card.Title>Masters</Card.Title>
                            <Card.Text>Manage Staff, Courses, Batches, etc.</Card.Text>
                            <Button as={Link} to="/admin/masters" variant="dark">Manage Masters</Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} className="mb-4">
                    <Card className="text-center shadow-sm h-100">
                        <Card.Body>
                            <Card.Title>Registered Students</Card.Title>
                            <Card.Text>View all students and download profiles.</Card.Text>
                            <Button as={Link} to="/admin/students" variant="info">View Students</Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} className="mb-4">
                    <Card className="text-center shadow-sm h-100">
                        <Card.Body>
                            <Card.Title>Payments</Card.Title>
                            <Card.Text>Manage Student Fees & Receipts.</Card.Text>
                            <Button as={Link} to="/admin/payments" variant="secondary">View Payments</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Dashboard;
