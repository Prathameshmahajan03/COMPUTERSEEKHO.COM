import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Row, Col, Card, Modal } from 'react-bootstrap';
import api from '../../services/api';

const StudentRegistration = () => {
    const [searchPhone, setSearchPhone] = useState('');
    const [enquiry, setEnquiry] = useState(null);
    const [courses, setCourses] = useState([]);
    const [batches, setBatches] = useState([]);
    const [status, setStatus] = useState({ type: '', msg: '' });

    // Payment Modal
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // Student Form Fields
    const [formData, setFormData] = useState({
        studentName: '',
        studentEmail: '',
        studentMobile: '',
        studentAddress: '',
        studentGender: '',
        studentDob: '',
        studentQualification: '',
        photoUrl: '',
        courseId: '',
        batchId: '',
        paymentDue: 0
    });

    const [paymentTypes, setPaymentTypes] = useState([]);
    const [payingAmount, setPayingAmount] = useState(0);
    const [selectedPaymentMode, setSelectedPaymentMode] = useState('');

    useEffect(() => {
        fetchMasters();
    }, []);

    const fetchMasters = async () => {
        try {
            const cRes = await api.get('/course/getAll');
            setCourses(cRes.data || []);
            const bRes = await api.get('/batch/all');
            setBatches(bRes.data || []);
            // Fetch Payment Types
            const pRes = await api.get('/paymentTypes/getAll');
            setPaymentTypes(pRes.data || []);
        } catch (e) { console.error("Masters load failed", e); }
    };

    const searchEnquiry = async () => {
        try {
            const res = await api.get(`/enquiries/search?mobile=${searchPhone}`);
            let found = Array.isArray(res.data) ? res.data[0] : res.data;

            if (found) {
                setEnquiry(found);
                const matchedCourse = courses.find(c => c.courseName === found.courseName);
                const cId = matchedCourse ? matchedCourse.courseId : '';
                const fee = matchedCourse ? matchedCourse.courseFee : 0;

                setFormData({
                    ...formData,
                    studentName: found.enquirerName,
                    studentEmail: found.enquirerEmailId,
                    studentMobile: found.enquirerMobile,
                    courseId: cId,
                    paymentDue: fee
                });
                setPayingAmount(fee); // Default to full payment
                setStatus({ type: 'success', msg: 'Enquiry Found! Course and Fee Pre-filled.' });
            }
        } catch (error) {
            console.error(error);
            setEnquiry(null);
            setStatus({ type: 'warning', msg: 'Enquiry not found' });
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('file', file);

        try {
            const res = await api.post('/image/upload', uploadData);
            if (res.data && res.data.url) {
                setFormData({ ...formData, photoUrl: res.data.url });
                setStatus({ type: 'success', msg: 'Image Uploaded Successfully!' });
            }
        } catch (error) {
            console.error("Image Upload Failed", error);
            setStatus({ type: 'danger', msg: 'Image Upload Failed: ' + (error.response?.data?.message || error.message) });
        }
    };

    const handleProceedClick = (e) => {
        e.preventDefault();
        if (!enquiry || !formData.courseId || !formData.batchId) {
            setStatus({ type: 'danger', msg: 'Please ensure Enquiry, Course and Batch are selected.' });
            return;
        }
        setShowPaymentModal(true);
    };

    const handlePaymentAndRegistration = async () => {
        if (!selectedPaymentMode) {
            alert("Please select a Payment Mode");
            return;
        }
        if (payingAmount <= 0) {
            alert("Please enter a valid paying amount");
            return;
        }

        setIsProcessing(true);
        setStatus({ type: '', msg: '' });

        try {
            // 1. Register Student
            // Ensure we send the FULL Course Fee as paymentDue to the backend initially
            // The backend should ideally enforce this, but we send it correct here.
            const studentPayload = {
                studentId: 0,
                studentName: formData.studentName,
                studentEmail: formData.studentEmail,
                studentMobile: formData.studentMobile,
                studentAddress: formData.studentAddress,
                studentGender: formData.studentGender,
                studentDob: formData.studentDob || null,
                studentQualification: formData.studentQualification,
                photoUrl: formData.photoUrl,
                paymentDue: parseFloat(formData.paymentDue), // Full Fee
                course: { courseId: parseInt(formData.courseId) },
                batch: { batchId: parseInt(formData.batchId) }
            };

            const studentRes = await api.post(`/student/add/${enquiry.enquiryId}`, studentPayload);
            const newStudent = studentRes.data;

            // 2. Process Payment
            const paymentPayload = {
                student: { studentId: newStudent.studentId },
                amount: parseFloat(payingAmount), // Actual Amount Paid
                paymentDate: new Date().toISOString().split('T')[0],
                paymentTypeId: { paymentTypeId: parseInt(selectedPaymentMode) }
            };

            await api.post('/payment/add', paymentPayload);

            // Success
            setStatus({ type: 'success', msg: 'Student Registered and Partial Payment of ₹' + payingAmount + ' Processed Successfully!' });
            setEnquiry(null);
            setSearchPhone('');
            setFormData({ ...formData, studentName: '', studentEmail: '', studentMobile: '', courseId: '', batchId: '', paymentDue: 0 });
            setPayingAmount(0);
            setSelectedPaymentMode('');
            setShowPaymentModal(false);

        } catch (error) {
            console.error("Registration/Payment Error", error);
            setStatus({ type: 'danger', msg: 'Registration or Payment Failed: ' + (error.response?.data?.message || error.message || JSON.stringify(error)) });
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <Container className="mt-4">
            <h2>Student Registration</h2>
            <Row className="mb-4">
                <Col md={6}>
                    <Card className="p-3">
                        <Form.Group className="mb-3">
                            <Form.Label>Search Enquiry by Mobile</Form.Label>
                            <div className="d-flex">
                                <Form.Control type="text" value={searchPhone} onChange={(e) => setSearchPhone(e.target.value)} />
                                <Button variant="secondary" className="ms-2" onClick={searchEnquiry}>Search</Button>
                            </div>
                        </Form.Group>
                        {status.msg && <Alert variant={status.type}>{status.msg}</Alert>}
                    </Card>
                </Col>
            </Row>

            {enquiry && (
                <Card className="p-4 shadow">
                    <h4>Enrollment Form</h4>
                    <Form onSubmit={handleProceedClick}>
                        <Row>
                            <Col md={6}><Form.Group className="mb-3"><Form.Label>Name</Form.Label><Form.Control type="text" value={formData.studentName} onChange={(e) => setFormData({ ...formData, studentName: e.target.value })} required /></Form.Group></Col>
                            <Col md={6}><Form.Group className="mb-3"><Form.Label>Email</Form.Label><Form.Control type="email" value={formData.studentEmail} onChange={(e) => setFormData({ ...formData, studentEmail: e.target.value })} required /></Form.Group></Col>
                            <Col md={6}><Form.Group className="mb-3"><Form.Label>Mobile</Form.Label><Form.Control type="text" value={formData.studentMobile} onChange={(e) => setFormData({ ...formData, studentMobile: e.target.value })} required /></Form.Group></Col>

                            <Col md={6}>
                                <Form.Group className="mb-3"><Form.Label>Course</Form.Label>
                                    <Form.Select value={formData.courseId} onChange={(e) => {
                                        const c = courses.find(x => x.courseId == e.target.value);
                                        setFormData({ ...formData, courseId: e.target.value, paymentDue: c ? c.courseFee : 0 });
                                    }} required>
                                        <option value="">Select Course</option>
                                        {courses.map(c => <option key={c.courseId} value={c.courseId}>{c.courseName}</option>)}
                                    </Form.Select>
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3"><Form.Label>Batch</Form.Label>
                                    <Form.Select value={formData.batchId} onChange={(e) => setFormData({ ...formData, batchId: e.target.value })} required>
                                        <option value="">Select Batch</option>
                                        {batches.filter(b => (!formData.courseId || b.course?.courseId == formData.courseId) && b.batchIsActive).map(b =>
                                            <option key={b.batchId} value={b.batchId}>{b.batchName}</option>
                                        )}
                                    </Form.Select>
                                </Form.Group>
                            </Col>

                            <Col md={6}><Form.Group className="mb-3"><Form.Label>Payment Due</Form.Label><Form.Control type="number" value={formData.paymentDue} readOnly /></Form.Group></Col>
                            <Col md={6}><Form.Group className="mb-3"><Form.Label>Gender</Form.Label>
                                <Form.Select value={formData.studentGender} onChange={(e) => setFormData({ ...formData, studentGender: e.target.value })}>
                                    <option value="">Select</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </Form.Select>
                            </Form.Group></Col>
                            <Col md={12}><Form.Group className="mb-3"><Form.Label>Address</Form.Label><Form.Control as="textarea" rows={2} value={formData.studentAddress} onChange={(e) => setFormData({ ...formData, studentAddress: e.target.value })} /></Form.Group></Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Student Photo</Form.Label>
                                    <Form.Control type="file" accept="image/*" onChange={handleImageUpload} />
                                    {formData.photoUrl && <div className="mt-2"><img src={formData.photoUrl} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'cover' }} /></div>}
                                </Form.Group>
                            </Col>
                        </Row>
                        <Button variant="primary" type="submit" size="lg">Proceed to Payment & Register</Button>
                    </Form>
                </Card>
            )}

            {/* Payment Gateway Modal */}
            <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)} backdrop="static" centered>
                <Modal.Header closeButton>
                    <Modal.Title>ComputerSeekho Secure Payment</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    <div className="text-center mb-4">
                        <h5>Total Course Fee</h5>
                        <h2 className="text-secondary">₹{formData.paymentDue?.toLocaleString()}</h2>
                    </div>

                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Payment Amount (Partial or Full)</Form.Label>
                            <Form.Control
                                type="number"
                                value={payingAmount}
                                onChange={(e) => setPayingAmount(e.target.value)}
                                max={formData.paymentDue}
                            />
                            <Form.Text className="text-muted">
                                Minimum recommended: ₹500
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Payment Mode</Form.Label>
                            <Form.Select
                                value={selectedPaymentMode}
                                onChange={(e) => setSelectedPaymentMode(e.target.value)}
                            >
                                <option value="">-- Select Payment Mode --</option>
                                {paymentTypes.map(pt => (
                                    <option key={pt.paymentTypeId} value={pt.paymentTypeId}>
                                        {pt.paymentTypeDesc}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Form>

                    {isProcessing && <div className="text-center my-3"><Alert variant="info">Processing Registration & Payment...</Alert></div>}

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowPaymentModal(false)} disabled={isProcessing}>Cancel</Button>
                    <Button variant="success" size="lg" onClick={handlePaymentAndRegistration} disabled={isProcessing}>
                        {isProcessing ? 'Processing...' : `Pay ₹${payingAmount} & Register`}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default StudentRegistration;

