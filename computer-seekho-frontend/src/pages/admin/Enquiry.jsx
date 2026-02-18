import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Table, Row, Col, Alert, Tab, Tabs } from 'react-bootstrap';
import api from '../../services/api';

const Enquiry = () => {
    const [enquiries, setEnquiries] = useState([]);
    const [getInTouchMessages, setGetInTouchMessages] = useState([]);
    const [formData, setFormData] = useState({
        enquirerName: '',
        enquirerMobile: '',
        enquirerEmailId: '',
        courseName: '',
        enquirerQuery: ''
    });

    const [status, setStatus] = useState({ type: '', msg: '' });
    const [key, setKey] = useState('enquiries');

    useEffect(() => {
        fetchEnquiries();
        fetchGetInTouch();
    }, []);

    const fetchEnquiries = async () => {
        try {
            const response = await api.get('/enquiries/getAll');
            setEnquiries(response.data);
        } catch (error) {
            console.error('Error fetching enquiries', error);
        }
    };

    const fetchGetInTouch = async () => {
        try {
            const response = await api.get('/getInTouch/getAll');
            setGetInTouchMessages(response.data);
        } catch (error) {
            console.error('Error fetching get in touch messages', error);
        }
    };

    const handleConvertToEnquiry = async (msg) => {
        if (!window.confirm(`Are you sure you want to convert message from ${msg.enquirerName} to an Enquiry?`)) return;

        try {
            const enquiryPayload = {
                enquirerName: msg.enquirerName,
                enquirerMobile: msg.mobile,
                enquirerEmailId: msg.email,
                courseName: msg.courseName || 'General',
                enquirerQuery: msg.enquiryMessage,
                enquiryStatus: 'Open'
            };

            // 1. Create Enquiry
            await api.post('/enquiries/create', enquiryPayload);

            // 2. Delete from Get In Touch (Move operation)
            await api.delete(`/getInTouch/delete/${msg.getInTouchId}`);

            setStatus({ type: 'success', msg: 'Message converted to Enquiry successfully!' });

            // 3. Refresh both lists
            fetchEnquiries();
            fetchGetInTouch();
            setKey('enquiries'); // Switch tag to show the new enquiry
        } catch (error) {
            console.error("Conversion failed", error);
            setStatus({ type: 'danger', msg: 'Failed to convert message.' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/enquiries/create', formData);
            setStatus({ type: 'success', msg: 'Enquiry Added Successfully' });
            fetchEnquiries();
            setFormData({ enquirerName: '', enquirerMobile: '', enquirerEmailId: '', courseName: '', enquirerQuery: '' });
        } catch (error) {
            setStatus({ type: 'danger', msg: 'Failed to add enquiry' });
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    return (
        <Container className="mt-4">
            <h2>Enquiry Management</h2>
            <Tabs
                id="enquiry-tabs"
                activeKey={key}
                onSelect={(k) => setKey(k)}
                className="mb-3"
            >
                <Tab eventKey="enquiries" title="General Enquiries">
                    <Row>
                        <Col md={4}>
                            <div className="border p-3 rounded shadow-sm">
                                <h4>Add New Enquiry</h4>
                                {status.msg && <Alert variant={status.type}>{status.msg}</Alert>}
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-2">
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control type="text" name="enquirerName" value={formData.enquirerName} onChange={handleChange} required />
                                    </Form.Group>
                                    <Form.Group className="mb-2">
                                        <Form.Label>Mobile</Form.Label>
                                        <Form.Control type="text" name="enquirerMobile" value={formData.enquirerMobile} onChange={handleChange} required />
                                    </Form.Group>
                                    <Form.Group className="mb-2">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control type="email" name="enquirerEmailId" value={formData.enquirerEmailId} onChange={handleChange} />
                                    </Form.Group>
                                    <Form.Group className="mb-2">
                                        <Form.Label>Course</Form.Label>
                                        <Form.Control type="text" name="courseName" value={formData.courseName} onChange={handleChange} />
                                    </Form.Group>
                                    <Form.Group className="mb-2">
                                        <Form.Label>Message</Form.Label>
                                        <Form.Control as="textarea" name="enquirerQuery" value={formData.enquirerQuery} onChange={handleChange} />
                                    </Form.Group>
                                    <Button variant="primary" type="submit" className="w-100 mt-2">Add Enquiry</Button>
                                </Form>
                            </div>
                        </Col>
                        <Col md={8}>
                            <h4>Recent Enquiries</h4>
                            <Table striped bordered hover size="sm">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Mobile</th>
                                        <th>Course</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {enquiries.map((e) => (
                                        <tr key={e.enquiryId}>
                                            <td>{e.enquiryId}</td>
                                            <td>{e.enquirerName}</td>
                                            <td>{e.enquirerMobile}</td>
                                            <td>{e.courseName}</td>
                                            <td>
                                                {!e.enquiryIsActive ? (
                                                    e.closureReason === 'Admitted' ? (
                                                        <span className="badge bg-primary">Confirmed</span>
                                                    ) : (
                                                        <span className="badge bg-danger">Closed</span>
                                                    )
                                                ) : (
                                                    <span className="badge bg-success">Open</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </Tab>
                <Tab eventKey="getInTouch" title="Website Messages">
                    <Row>
                        <Col>
                            <h4>Messages from "Get In Touch" Form</h4>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Mobile</th>
                                        <th>Message</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {getInTouchMessages.map((msg) => (
                                        <tr key={msg.getInTouchId}>
                                            <td>{msg.getInTouchId}</td>
                                            <td>{msg.enquirerName}</td>
                                            <td>{msg.email}</td>
                                            <td>{msg.mobile}</td>
                                            <td>{msg.enquiryMessage}</td>
                                            <td>
                                                <Button
                                                    variant="success"
                                                    size="sm"
                                                    onClick={() => handleConvertToEnquiry(msg)}
                                                >
                                                    Convert to Enquiry
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </Tab>
            </Tabs>
        </Container>
    );
};

export default Enquiry;
