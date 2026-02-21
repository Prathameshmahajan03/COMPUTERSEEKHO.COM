import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import api from '../services/api';

const Faculty = () => {
    const [staff, setStaff] = useState([]);

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        try {
            const response = await api.get('/staff/getAll');
            // Filter for teaching staff if necessary, or show all
            setStaff(response.data);
        } catch (error) {
            console.error('Error fetching staff:', error);
        }
    };

    return (
        <Container className="mt-4">
            <h2 className="mb-4">Our Faculty</h2>
            <Row>
                {staff.map((member) => (
                    <Col md={3} key={member.staffId} className="mb-4">
                        <Card className="h-100 text-center shadow-sm">
                            <div className="text-center mt-3">
                                <img
                                    src={member.photoUrl || '/images/faculty-default.jpg'}
                                    alt={member.staffName}
                                    className="rounded-circle"
                                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                                />
                            </div>
                            <Card.Body>
                                <Card.Title>{member.staffName}</Card.Title>
                                <Card.Text className="text-muted">{member.staffRole || 'Faculty'}</Card.Text>
                                <Card.Text>{member.staffEmail}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default Faculty;
