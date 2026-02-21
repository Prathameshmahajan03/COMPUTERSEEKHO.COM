import React, { useState, useEffect, useContext } from 'react';
import { Container, Table, Button, Form, Modal, Row, Col } from 'react-bootstrap';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import Sidebar from '../../components/common/Sidebar';

const Followups = () => {
    const { user } = useContext(AuthContext);
    const [enquiries, setEnquiries] = useState([]);
    const [selectedEnquiry, setSelectedEnquiry] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [followupMsg, setFollowupMsg] = useState('');

    const [statusUpdate, setStatusUpdate] = useState('Open');

    useEffect(() => {
        if (user) fetchEnquiries();
    }, [user]);

    const fetchEnquiries = async () => {
        try {
            if (!user?.username) return;
            const response = await api.get(`/enquiries/getbystaff/${user.username}`);
            // Backend already filters by active status
            setEnquiries(response.data || []);
        } catch (error) {
            console.error('Error fetching followups', error);
            try {
                // Fallback (Logic kept from before, but simplified)
                const res = await api.get('/enquiries/getAll');
                const adminEnquiries = res.data.filter(e => e.staff?.staffUsername === user.username && e.enquiryIsActive);
                setEnquiries(adminEnquiries);
            } catch (e) { }
        }
    };

    const handleCall = (enquiry) => {
        setSelectedEnquiry(enquiry);
        setFollowupMsg(enquiry.enquirerQuery || '');
        setStatusUpdate('Open');
        setShowModal(true);
    };

    const handleUpdate = async () => {
        try {
            if (statusUpdate === 'Closed') {
                await api.put(`/enquiries/deactivate/${selectedEnquiry.enquiryId}`, followupMsg || "Closed by Admin", {
                    headers: { 'Content-Type': 'text/plain' }
                });
            } else {
                await api.put(`/enquiries/updateMessage/${selectedEnquiry.enquiryId}`, followupMsg, {
                    headers: { 'Content-Type': 'text/plain' }
                });
            }

            setShowModal(false);
            fetchEnquiries();
        } catch (error) {
            console.error("Update failed", error);
        }
    };



    // ... (existing imports and component logic)

    return (
        <Container fluid>
            <Row>
                <Col md={2} className="p-0">
                    <Sidebar />
                </Col>
                <Col md={10} className="p-4">
                    <Container>
                        <h2>My Follow-ups {user?.username ? `(${user.username})` : ''}</h2>
                        {/* Existing Table Code */}
                        <Table striped bordered hover>
                            {/* ... same table content ... */}
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Mobile</th>
                                    <th>Last Message</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {enquiries.map(e => (
                                    <tr key={e.enquiryId}>
                                        <td>{e.enquirerName}</td>
                                        <td>{e.enquirerMobile}</td>
                                        <td>{e.enquirerQuery || e.closureReason}</td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                <Button
                                                    variant="success"
                                                    size="sm"
                                                    onClick={() => window.location.href = `tel:${e.enquirerMobile}`}
                                                >
                                                    Call Now
                                                </Button>
                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    onClick={() => handleCall(e)}
                                                >
                                                    Update Status
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>

                        <Modal show={showModal} onHide={() => setShowModal(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title>Update Follow-up: {selectedEnquiry?.enquirerName}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <p>Phone: {selectedEnquiry?.enquirerMobile}</p>
                                <Form.Group className="mb-3">
                                    <Form.Label>Status</Form.Label>
                                    <Form.Select
                                        value={statusUpdate}
                                        onChange={(e) => setStatusUpdate(e.target.value)}
                                    >
                                        <option value="Open">Open (Follow-up)</option>
                                        <option value="Closed">Closed (Not Interested)</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Add Remark / Message</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        value={followupMsg}
                                        onChange={(e) => setFollowupMsg(e.target.value)}
                                    />
                                </Form.Group>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                                <Button variant={statusUpdate === 'Closed' ? 'danger' : 'primary'} onClick={handleUpdate}>
                                    {statusUpdate === 'Closed' ? 'Close Enquiry' : 'Save Follow-up'}
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </Container>
                </Col>
            </Row>
        </Container>
    );
};

export default Followups;
