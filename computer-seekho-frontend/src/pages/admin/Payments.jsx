import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import api from '../../services/api';

const Payments = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [students, setStudents] = useState([]);
    const [formData, setFormData] = useState({
        studentId: '',
        amount: '',
        paymentTypeId: 1, // Default Cash (assuming 1)
        paymentDate: new Date().toISOString().split('T')[0]
    });
    const [status, setStatus] = useState({ type: '', msg: '' });

    useEffect(() => {
        fetchPayments();
        fetchStudents();
    }, []);

    const fetchPayments = async () => {
        try {
            const res = await api.get('/payment/getAll');
            setPayments(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStudents = async () => {
        try {
            const res = await api.get('/student/getAll');
            console.log("Fetched Students:", res.data); // Debug
            // Sort by name
            const sorted = (res.data || []).sort((a, b) => a.studentName.localeCompare(b.studentName));
            setStudents(sorted);
        } catch (error) { console.error("Fetch Students Error", error); }
    };

    const handleAddPayment = async () => {
        if (!formData.studentId || !formData.amount) {
            alert("Please select student and amount");
            return;
        }

        const payload = {
            student: { studentId: parseInt(formData.studentId) },
            amount: parseFloat(formData.amount),
            paymentDate: formData.paymentDate,
            paymentTypeId: { paymentTypeId: parseInt(formData.paymentTypeId) }
        };

        try {
            await api.post('/payment/add', payload);
            setStatus({ type: 'success', msg: 'Payment Recorded Successfully' });
            setShowModal(false);
            fetchPayments();
            // Reset form
            setFormData({ ...formData, studentId: '', amount: '' });
        } catch (error) {
            console.error(error);
            setStatus({ type: 'danger', msg: 'Failed to record payment. Check Dues.' });
        }
    };

    // Helper to find student name from ID if needed, but payment object has nested student usually
    // Based on Payment.java: private Student student;

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between mb-3">
                <h2>Payment History</h2>
                <Button variant="primary" onClick={() => setShowModal(true)}>Add Manual Payment</Button>
            </div>

            {status.msg && <Alert variant={status.type} onClose={() => setStatus({ type: '', msg: '' })} dismissible>{status.msg}</Alert>}

            {loading ? <Spinner animation="border" /> : (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Student</th>
                            <th>Amount</th>
                            <th>Date</th>
                            <th>Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map(p => (
                            <tr key={p.paymentId}>
                                <td>{p.paymentId}</td>
                                <td>{p.student ? p.student.studentName : 'Unknown'}</td>
                                <td>₹{p.amount}</td>
                                <td>{p.paymentDate}</td>
                                <td>{p.paymentTypeId ? p.paymentTypeId.paymentTypeDesc : 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton><Modal.Title>Record Payment</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Student</Form.Label>
                            <Form.Select
                                value={formData.studentId}
                                onChange={(e) => {
                                    const sid = e.target.value;
                                    const stu = students.find(s => s.studentId == sid);
                                    setFormData({ ...formData, studentId: sid, amount: stu ? stu.paymentDue : '' });
                                }}
                            >
                                <option value="">-- Select Student --</option>
                                {students.length === 0 && <option disabled>No Students Loaded</option>}
                                {students.map(s => (
                                    <option key={s.studentId} value={s.studentId}>
                                        {s.studentName} (Due: ₹{s.paymentDue})
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Amount</Form.Label>
                            <Form.Control type="number" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Payment Type</Form.Label>
                            <Form.Select value={formData.paymentTypeId} onChange={e => setFormData({ ...formData, paymentTypeId: e.target.value })}>
                                <option value="1">Cash</option>
                                <option value="2">Cheque</option>
                                <option value="3">Online Transfer</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Date</Form.Label>
                            <Form.Control type="date" value={formData.paymentDate} onChange={e => setFormData({ ...formData, paymentDate: e.target.value })} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                    <Button variant="success" onClick={handleAddPayment}>Record Payment</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default Payments;
