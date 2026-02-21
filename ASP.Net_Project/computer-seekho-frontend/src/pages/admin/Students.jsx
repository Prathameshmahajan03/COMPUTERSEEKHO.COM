import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Alert, Card, Spinner, Modal, Form } from 'react-bootstrap';
import api from '../../services/api';

const Students = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Placement Modal State
    const [showModal, setShowModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [recruiters, setRecruiters] = useState([]);
    const [selectedRecruiterId, setSelectedRecruiterId] = useState('');
    const [placedStudentIds, setPlacedStudentIds] = useState(new Set());

    useEffect(() => {
        fetchStudents();
        fetchRecruiters();
        fetchPlacements();
    }, []);

    const fetchPlacements = async () => {
        try {
            const response = await api.get('/placement/all');
            const ids = new Set(response.data.map(p => p.studentID.studentId));
            setPlacedStudentIds(ids);
        } catch (err) {
            console.error("Failed to fetch placements", err);
        }
    }

    const fetchStudents = async () => {
        try {
            const response = await api.get('/student/getAll');
            setStudents(response.data || []);
        } catch (err) {
            console.error("Failed to fetch students", err);
            setError('Failed to load students.');
        } finally {
            setLoading(false);
        }
    };

    const fetchRecruiters = async () => {
        try {
            const response = await api.get('/recruiter/getAll');
            setRecruiters(response.data || []);
        } catch (err) {
            console.error("Failed to fetch recruiters", err);
        }
    };

    const handlePlaceClick = (student) => {
        setSelectedStudent(student);
        setShowModal(true);
    };

    const handlePlacementSubmit = async () => {
        if (!selectedRecruiterId) {
            alert("Please select a recruiter");
            return;
        }
        if (!selectedStudent || !selectedStudent.batch) {
            alert("Student or Batch data missing");
            return;
        }

        const payload = {
            studentID: { studentId: selectedStudent.studentId },
            recruiterID: { recruiterId: parseInt(selectedRecruiterId) },
            batch: { batchId: selectedStudent.batch.batchId }
        };

        try {
            await api.post('/placement/add', payload);
            alert("Student Placed Successfully!");
            setShowModal(false);
            setSelectedRecruiterId('');
            fetchPlacements(); // Refresh list to update buttons
        } catch (err) {
            console.error(err);
            alert("Failed to place student");
        }
    };

    const downloadPdf = async (studentId, studentName) => {
        try {
            const response = await api.get(`/student/pdf/${studentId}`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${studentName ? studentName.replace(/\s+/g, '_') : 'Student'}_Profile.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error("PDF Download failed", err);
            alert("Failed to download PDF. Please try again.");
        }
    };

    return (
        <Container className="mt-4">
            <h2 className="mb-4">Registered Students</h2>

            {error && <Alert variant="danger">{error}</Alert>}

            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            ) : (
                <Card className="shadow-sm">
                    <Card.Body>
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Mobile</th>
                                    <th>Course</th>
                                    <th>Batch</th>
                                    {/* <th>Payment Due</th> Removed as per request */}
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.length > 0 ? (
                                    students.map((student) => (
                                        <tr key={student.studentId}>
                                            <td>{student.studentId}</td>
                                            <td> {student.studentName} </td>
                                            <td>{student.studentMobile}</td>
                                            <td>{student.course ? student.course.courseName : 'N/A'}</td>
                                            <td>{student.batch ? student.batch.batchName : 'N/A'}</td>
                                            {/* <td>{student.paymentDue}</td> */}
                                            <td>
                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    className="me-2"
                                                    onClick={() => downloadPdf(student.studentId, student.studentName)}
                                                >
                                                    PDF
                                                </Button>
                                                {placedStudentIds.has(student.studentId) ? (
                                                    <Button variant="secondary" size="sm" disabled>Placed</Button>
                                                ) : student.paymentDue > 0 ? (
                                                    <Button variant="warning" size="sm" disabled title="Clear Fees to Place">Fees Pending</Button>
                                                ) : (
                                                    <Button
                                                        variant="success"
                                                        size="sm"
                                                        onClick={() => handlePlaceClick(student)}
                                                    >
                                                        Place
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center">No Registered Students Found</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            )}

            {/* Placement Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Place Student: {selectedStudent?.studentName}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Select Company</Form.Label>
                            <Form.Select
                                value={selectedRecruiterId}
                                onChange={(e) => setSelectedRecruiterId(e.target.value)}
                            >
                                <option value="">-- Select Recruiter --</option>
                                {recruiters.map((r) => (
                                    <option key={r.recruiterId} value={r.recruiterId}>
                                        {r.recruiterName} ({r.recruiterLocation})
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <p>
                            <strong>Batch:</strong> {selectedStudent?.batch?.batchName || 'N/A'}
                        </p>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handlePlacementSubmit}>
                        Confirm Placement
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default Students;
