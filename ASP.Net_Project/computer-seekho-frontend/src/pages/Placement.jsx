import React, { useEffect, useState } from 'react';
import { Container, Tab, Tabs, Row, Col, Card, Table, Button } from 'react-bootstrap';
import api from '../services/api';

const Placement = () => {
    const [recruiters, setRecruiters] = useState([]);
    const [allPlacements, setAllPlacements] = useState([]); // Store master list
    const [placements, setPlacements] = useState([]); // Store displayed list
    const [activeTab, setActiveTab] = useState('recruiters');
    const [filterMessage, setFilterMessage] = useState('');

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
            setAllPlacements(response.data || []);
            setPlacements(response.data || []);
        } catch (error) {
            console.error('Error fetching placements:', error);
        }
    };

    const handleRecruiterClick = (recruiter) => {
        // Filter placements for this recruiter
        const filtered = allPlacements.filter(p => p.recruiterID?.recruiterId === recruiter.recruiterId);
        setPlacements(filtered);
        setFilterMessage(`Showing students placed in ${recruiter.recruiterName}`);
        setActiveTab('placed_students');
    };

    const handleResetFilter = () => {
        setPlacements(allPlacements);
        setFilterMessage('');
    };

    return (
        <Container className="mt-4">
            <h2 className="mb-4">Placements</h2>
            <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} id="placement-tabs" className="mb-3">
                <Tab eventKey="recruiters" title="Our Recruiters">
                    <Row>
                        {recruiters.map((recruiter) => (
                            <Col md={3} key={recruiter.recruiterId} className="mb-4">
                                <Card
                                    className="h-100 border-0 shadow-sm p-3"
                                    style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                                    onClick={() => handleRecruiterClick(recruiter)}
                                    // Add hover effect via simple inline style or class
                                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                >
                                    <Card.Img
                                        variant="top"
                                        src={recruiter.recruiterPhotoUrl || '/images/logo.jpg'}
                                        style={{ height: '100px', objectFit: 'contain' }}
                                    />
                                    <Card.Body className="text-center">
                                        <Card.Title>{recruiter.recruiterName}</Card.Title>
                                        <Card.Text>{recruiter.recruiterLocation}</Card.Text>
                                        <small className="text-primary">Click to view students</small>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Tab>
                <Tab eventKey="placed_students" title="Placed Students">
                    {filterMessage && (
                        <div className="d-flex justify-content-between align-items-center mb-3 alert alert-info">
                            <span>{filterMessage}</span>
                            <Button variant="outline-primary" size="sm" onClick={handleResetFilter}>Show All Students</Button>
                        </div>
                    )}
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
                            {placements.length > 0 ? (
                                placements.map((p) => (
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
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center">No placed students found for this selection.</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Tab>
            </Tabs>
        </Container>
    );
};

export default Placement;
