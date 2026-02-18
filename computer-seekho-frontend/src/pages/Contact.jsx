import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import api from '../services/api';

const Contact = () => {
    const [formData, setFormData] = useState({
        enquirerName: '',
        email: '',
        mobile: '',
        enquiryMessage: ''
    });
    const [status, setStatus] = useState({ type: '', msg: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                enquirerName: formData.enquirerName,
                email: formData.email,
                mobile: formData.mobile,
                enquiryMessage: formData.enquiryMessage,
                courseName: "General Enquiry" // Default value or handled by backend if null
            };

            await api.post('/getInTouch/add', payload);
            setStatus({ type: 'success', msg: 'Message sent successfully!' });
            setFormData({ enquirerName: '', email: '', mobile: '', enquiryMessage: '' });
        } catch (error) {
            console.error('Error sending message:', error);
            setStatus({ type: 'danger', msg: 'Failed to send message. Please try again.' });
        }
    };

    return (
        <Container className="mt-4">
            <h2 className="mb-4">Contact Us</h2>
            <Row>
                <Col md={6}>
                    <h4>Get in Touch</h4>
                    <p>We'd love to hear from you. Fill out the form below.</p>
                    {status.msg && <Alert variant={status.type}>{status.msg}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="enquirerName"
                                value={formData.enquirerName}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Mobile Number</Form.Label>
                            <Form.Control
                                type="tel"
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleChange}
                                pattern="[0-9]{10}"
                                title="Please enter a valid 10-digit mobile number"
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Message</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                name="enquiryMessage"
                                value={formData.enquiryMessage}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Send Message
                        </Button>
                    </Form>
                </Col>
                <Col md={6}>
                    <h4>Reach Us At</h4>
                    <div className="ratio ratio-16x9">
                        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.9265275816964!2d72.85303931490105!3d19.0669649870932!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c91cfb0aaaaa%3A0x1234567890abcdef!2sMumbai!5e0!3m2!1sen!2sin"
                            loading="lazy"></iframe>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Contact;
