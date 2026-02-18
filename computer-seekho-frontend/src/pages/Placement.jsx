import React, { useEffect, useState } from 'react';
import { Container, Tab, Tabs, Row, Col, Card, Table } from 'react-bootstrap';
import api from '../services/api';

const Placement = () => {
    const [recruiters, setRecruiters] = useState([]);
    const [placements, setPlacements] = useState([]);

    useEffect(() => {
        fetchRecruiters();
        fetchPlacements();
    }, []);

    const fetchRecruiters = async () => {
        try {
            const response = await api.get('/recruiter/getAll');
            setRecruiters(response.data);
        } catch (error) {
            console.error('Error fetching recruiters:', error);
        }
    };

    const fetchPlacements = async () => {
        try {
            const response = await api.get('/placement/all');
            console.log("Placements Raw Response:", response);
            setPlacements(response.data);
        } catch (error) {
            console.error('Error fetching placements:', error);
            alert("Error fetching placements: " + error.message);
        }
    };

    return (
        <Container className="mt-4">
            <h2 className="mb-4">Placements</h2>
            <Tabs defaultActiveKey="recruiters" id="placement-tabs" className="mb-3">
                <Tab eventKey="recruiters" title="Our Recruiters">
                    <Row>
                        {recruiters.map((recruiter) => (
                            <Col md={3} key={recruiter.recruiterId} className="mb-4">
                                <Card className="h-100 border-0 shadow-sm p-3">
                                    <Card.Img
                                        variant="top"
                                        src={recruiter.recruiterPhotoUrl || '/images/logo.jpg'}
                                        style={{ height: '100px', objectFit: 'contain' }}
                                    />
                                    <Card.Body className="text-center">
                                        <Card.Title>{recruiter.recruiterName}</Card.Title>
                                        <Card.Text>{recruiter.recruiterLocation}</Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Tab>
                <Tab eventKey="placed_students" title="Placed Students">
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Student Photo</th>
                                <th>Student Name</th>
                                <th>Batch</th>
                                <th>Company</th>
                            </tr>
                        </thead>
                        <tbody>
                            {placements.map((p) => (
                                <tr key={p.placementID}>
                                    <td>
                                        <img
                                            src={p.studentID?.photoUrl || '/images/logo.jpg'}
                                            alt={p.studentID?.studentName}
                                            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '50%' }}
                                            onError={(e) => { e.target.src = '/images/logo.jpg'; }}
                                        />
                                    </td>
                                    <td>{p.studentID ? p.studentID.studentName : 'N/A'}</td>
                                    <td>{p.batch ? p.batch.batchName : 'N/A'}</td>
                                    <td>{p.recruiterID ? p.recruiterID.recruiterName : 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Tab>
            </Tabs>
        </Container>
    );
};

export default Placement;
