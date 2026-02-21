import React, { useState, useEffect } from 'react';
import { Container, Tabs, Tab, Table, Button, Form, Modal, Row, Col } from 'react-bootstrap';
import api from '../../services/api';

const Masters = () => {
    const [key, setKey] = useState('courses');
    const [data, setData] = useState([]);
    const [courses, setCourses] = useState([]); // Store courses for dropdowns

    // Generic Fetch
    useEffect(() => {
        fetchData();
    }, [key]);

    const fetchData = async () => {
        let endpoint = '';
        if (key === 'courses') endpoint = '/course/getAll';
        else if (key === 'staff') endpoint = '/staff/getAll';
        else if (key === 'recruiters') endpoint = '/recruiter/getAll';
        else if (key === 'news') endpoint = '/News/all';
        else if (key === 'batches') endpoint = '/batch/all';

        if (endpoint) {
            try {
                const res = await api.get(endpoint);
                setData(res.data);

                // Always ensure courses are loaded (needed for Dropdowns)
                if (courses.length === 0) {
                    const cRes = await api.get('/course/getAll');
                    setCourses(cRes.data);
                }
            } catch (err) {
                console.error(err);
                setData([]);
            }
        }
    };

    // Placeholder for Add/Edit using Modal...
    // For MVP, just displaying list is a good start.

    const [recruiterPhoto, setRecruiterPhoto] = useState('');
    const [staffPhoto, setStaffPhoto] = useState('');
    const [coursePhoto, setCoursePhoto] = useState('');

    const handleRecruiterImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await api.post('/image/upload', formData);
            if (res.data && res.data.url) {
                setRecruiterPhoto(res.data.url);
                alert("Image Uploaded Successfully!");
            }
        } catch (error) {
            console.error("Recruiter Image Upload Failed", error);
            alert("Image Upload Failed: " + (error.response?.data?.message || error.message));
        }
    };

    const handleStaffImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await api.post('/image/upload', formData);
            if (res.data && res.data.url) {
                setStaffPhoto(res.data.url);
                alert("Staff Image Uploaded Successfully!");
            }
        } catch (error) {
            console.error("Staff Image Upload Failed", error);
            alert("Image Upload Failed: " + (error.response?.data?.message || error.message));
        }
    };

    const handleCourseImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await api.post('/image/upload', formData);
            if (res.data && res.data.url) {
                setCoursePhoto(res.data.url);
                alert("Course Image Uploaded Successfully!");
            }
        } catch (error) {
            console.error("Course Image Upload Failed", error);
            alert("Image Upload Failed: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <Container className="mt-4">
            <h2>Master Maintenance</h2>
            <Tabs activeKey={key} onSelect={(k) => setKey(k)} className="mb-3">

                {/* --- COURSES TAB --- */}
                <Tab eventKey="courses" title="Courses">
                    <div className="mb-3 p-3 border rounded bg-light">
                        <h5>Add New Course</h5>
                        <Form onSubmit={async (e) => {
                            e.preventDefault();
                            const formData = {
                                courseName: e.target.courseName.value,
                                courseDuration: e.target.courseDuration.value,
                                courseFee: e.target.courseFee.value,
                                courseIsActive: true,
                                coverPhoto: coursePhoto || "default_course.png"
                            };
                            try {
                                await api.post('/course/add', formData);
                                alert("Course Added!");
                                fetchData();
                                fetchData();
                                e.target.reset();
                                setCoursePhoto('');
                            } catch (err) { alert("Failed to add course: " + (err.response?.data?.message || err.message)); }
                        }}>
                            <Row>
                                <Col><Form.Control name="courseName" placeholder="Course Name" required /></Col>
                                <Col><Form.Control name="courseDuration" placeholder="Duration (e.g. 6 Months)" required /></Col>
                                <Col><Form.Control name="courseFee" type="number" placeholder="Fee" required /></Col>
                                <Col>
                                    <Form.Control type="file" accept="image/*" onChange={handleCourseImageUpload} />
                                    {coursePhoto && <small className="text-success">Image Selected</small>}
                                </Col>
                                <Col><Button type="submit">Add</Button></Col>
                            </Row>
                        </Form>
                    </div>
                    <Table striped bordered hover>
                        <thead><tr><th>Name</th><th>Duration</th><th>Fee</th><th>Active</th><th>Action</th></tr></thead>
                        <tbody>{data.map((c) => (
                            <tr key={c.courseId}>
                                <td>{c.courseName}</td>
                                <td>{c.courseDuration}</td>
                                <td>{c.courseFee}</td>
                                <td>{c.courseIsActive ? 'Yes' : 'No'}</td>
                                <td>
                                    <Button variant="danger" size="sm" onClick={async () => {
                                        if (window.confirm("Are you sure? note: Deleting a course with students will fail.")) {
                                            try {
                                                await api.delete(`/course/delete/${c.courseId}`);
                                                fetchData();
                                            }
                                            catch (e) {
                                                alert("Unable to delete: Linked data exists. Try deactivating instead (Future Feature).");
                                            }
                                        }
                                    }}>Delete</Button>
                                </td>
                            </tr>
                        ))}</tbody>
                    </Table>
                </Tab>

                {/* --- STAFF TAB --- */}
                <Tab eventKey="staff" title="Staff">
                    <div className="mb-3 p-3 border rounded bg-light">
                        <h5>Add New Staff</h5>
                        <Form onSubmit={async (e) => {
                            e.preventDefault();
                            const formData = {
                                staffName: e.target.staffName.value,
                                staffEmail: e.target.staffEmail.value,
                                staffMobile: e.target.staffMobile.value,
                                staffRole: e.target.staffRole.value,
                                staffUsername: e.target.staffUsername.value,
                                staffPassword: e.target.staffPassword.value,
                                staffGender: "Not Specified", // Default
                                photoUrl: staffPhoto || "default.png"
                            };
                            try {
                                await api.post('/staff/add', formData);
                                alert("Staff Added!");
                                fetchData();
                                e.target.reset();
                                setStaffPhoto('');
                            } catch (err) { alert("Failed to add staff: " + (err.response?.data?.message || err.message)); }
                        }}>
                            <Row className="mb-2">
                                <Col><Form.Control name="staffName" placeholder="Name" required /></Col>
                                <Col><Form.Control name="staffEmail" type="email" placeholder="Email" required /></Col>
                                <Col><Form.Control name="staffMobile" placeholder="Mobile" required /></Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Select name="staffRole" required>
                                        <option value="ROLE_TEACHER">Teacher</option>
                                        <option value="ROLE_ADMIN">Admin</option>
                                        <option value="ROLE_RECEPTIONIST">Receptionist</option>
                                    </Form.Select>
                                </Col>
                                <Col><Form.Control name="staffUsername" placeholder="Username" required /></Col>
                                <Col><Form.Control name="staffPassword" type="password" placeholder="Password" required /></Col>
                                <Col>
                                    <Form.Control type="file" accept="image/*" onChange={handleStaffImageUpload} />
                                    {staffPhoto && <small className="text-success">Image Selected</small>}
                                </Col>
                                <Col><Button type="submit">Add Staff</Button></Col>
                            </Row>
                        </Form>
                    </div>
                    <Table striped bordered hover>
                        <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Action</th></tr></thead>
                        <tbody>{data.map((s) => (
                            <tr key={s.staffId}>
                                <td>{s.staffName}</td>
                                <td>{s.staffEmail}</td>
                                <td>{s.staffRole}</td>
                                <td>
                                    <Button variant="danger" size="sm" onClick={async () => {
                                        if (window.confirm("Are you sure? note: Deleting staff with linked data will fail.")) {
                                            try { await api.delete(`/staff/delete/${s.staffId}`); fetchData(); }
                                            catch (e) { alert("Unable to delete: Linked data exists."); }
                                        }
                                    }}>Delete</Button>
                                </td>
                            </tr>
                        ))}</tbody>
                    </Table>
                </Tab>

                {/* --- BATCHES TAB --- */}
                <Tab eventKey="batches" title="Batches">
                    <div className="mb-3 p-3 border rounded bg-light">
                        <h5>Add New Batch</h5>
                        <Form onSubmit={async (e) => {
                            e.preventDefault();
                            const formData = {
                                batchName: e.target.batchName.value,
                                batchTime: e.target.batchTime.value,
                                batchIsActive: true,
                                course: { courseId: e.target.courseId.value }
                            };
                            try {
                                await api.post('/batch/add', formData);
                                alert("Batch Added!");
                                fetchData();
                                e.target.reset();
                            } catch (err) { alert("Failed to add batch"); }
                        }}>
                            <Row>
                                <Col>
                                    <Form.Select name="courseId" required>
                                        <option value="">Select Course</option>
                                        {courses.map(c => <option key={c.courseId} value={c.courseId}>{c.courseName}</option>)}
                                    </Form.Select>
                                </Col>
                                <Col><Form.Control name="batchName" placeholder="Batch Name" required /></Col>
                                <Col><Form.Control name="batchTime" placeholder="Time (e.g. 10:00 AM)" required /></Col>
                                <Col><Button type="submit">Add Batch</Button></Col>
                            </Row>
                        </Form>
                    </div>
                    <Table striped bordered hover>
                        <thead><tr><th>Batch Name</th><th>Course</th><th>Time</th><th>Active</th><th>Action</th></tr></thead>
                        <tbody>{data.map((b) => (
                            <tr key={b.batchId}>
                                <td>{b.batchName}</td>
                                <td>{b.course ? b.course.courseName : 'N/A'}</td>
                                <td>{b.batchTime}</td>
                                <td>{b.batchIsActive ? 'Yes' : 'No'}</td>
                                <td>
                                    <Button variant="danger" size="sm" onClick={async () => {
                                        if (window.confirm("Are you sure? note: Deleting batch with students will fail.")) {
                                            try { await api.delete(`/batch/delete/${b.batchId}`); fetchData(); }
                                            catch (e) { alert("Unable to delete: Linked data exists."); }
                                        }
                                    }}>Delete</Button>
                                    <Button variant="outline-warning" size="sm" className="ms-2" onClick={async () => {
                                        try {
                                            await api.put(`/batch/activate/${b.batchId}/${!b.batchIsActive}`);
                                            fetchData();
                                        } catch (e) { alert("Status Change Failed"); }
                                    }}>{b.batchIsActive ? 'Deactivate' : 'Activate'}</Button>
                                </td>
                            </tr>
                        ))}</tbody>
                    </Table>
                </Tab>

                <Tab eventKey="recruiters" title="Recruiters">
                    <div className="mb-3 p-3 border rounded bg-light">
                        <h5>Add New Recruiter</h5>
                        <Form onSubmit={async (e) => {
                            e.preventDefault();
                            const formData = {
                                recruiterName: e.target.recruiterName.value,
                                recruiterLocation: e.target.recruiterLocation.value,
                                recruiterPhotoUrl: recruiterPhoto || "default_recruiter.png"
                            };
                            try {
                                await api.post('/recruiter/add', formData);
                                alert("Recruiter Added!");
                                fetchData();
                                e.target.reset();
                                setRecruiterPhoto('');
                            } catch (err) {
                                console.error(err);
                                alert("Failed to add recruiter");
                            }
                        }}>
                            <Row>
                                <Col md={4}><Form.Control name="recruiterName" placeholder="Recruiter Name" required /></Col>
                                <Col md={4}><Form.Control name="recruiterLocation" placeholder="Location" required /></Col>
                                <Col md={4}>
                                    <Form.Control type="file" accept="image/*" onChange={handleRecruiterImageUpload} />
                                    {recruiterPhoto && <small className="text-success">Image Selected</small>}
                                </Col>
                                <Col md={12} className="mt-2"><Button type="submit">Add Recruiter</Button></Col>
                            </Row>
                        </Form>
                    </div>
                    <Table striped bordered hover>
                        <thead><tr><th>Name</th><th>Location</th><th>Action</th></tr></thead>
                        <tbody>{data.map((r) => (
                            <tr key={r.recruiterId}>
                                <td>{r.recruiterName}</td>
                                <td>{r.recruiterLocation}</td>
                                <td>
                                    <Button variant="danger" size="sm" onClick={async () => {
                                        if (window.confirm("Are you sure? note: Deleting recruiter with placements will fail.")) {
                                            try { await api.delete(`/recruiter/delete/${r.recruiterId}`); fetchData(); }
                                            catch (e) { alert("Unable to delete: Linked data exists."); }
                                        }
                                    }}>Delete</Button>
                                </td>
                            </tr>
                        ))}</tbody>
                    </Table>
                </Tab>

                <Tab eventKey="news" title="News">
                    <div className="mb-3">
                        <Form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = {
                                newsTitle: e.target.newsTitle.value,
                                newsDescription: e.target.newsDescription.value,
                                newsUrl: e.target.newsUrl.value || 'http://default.url'
                            };
                            api.post('/News/add', formData).then(() => {
                                alert('News Added!');
                                fetchData();
                                e.target.reset();
                            }).catch(err => alert('Error adding news'));
                        }}>
                            <Row>
                                <Col><Form.Control name="newsTitle" placeholder="Title" required /></Col>
                                <Col><Form.Control name="newsDescription" placeholder="Description" required /></Col>
                                <Col><Form.Control name="newsUrl" placeholder="URL" /></Col>
                                <Col><Button type="submit">Add News</Button></Col>
                            </Row>
                        </Form>
                    </div>
                    <Table striped bordered hover>
                        <thead><tr><th>ID</th><th>Title</th><th>Description</th></tr></thead>
                        <tbody>{data.map((n, i) => <tr key={i}><td>{n.newsId}</td><td>{n.newsTitle}</td><td>{n.newsDescription}</td></tr>)}</tbody>
                    </Table>
                </Tab>
                <Tab eventKey="upload" title="Excel Upload">
                    <div className="p-4 border rounded shadow-sm bg-light">
                        <h4>Bulk Data Upload</h4>
                        <p>Upload Excel files (.xlsx) to bulk import data.</p>
                        <Form onSubmit={(e) => {
                            e.preventDefault();
                            if (!e.target.file.files[0]) return alert("Select a file");

                            const formData = new FormData();
                            formData.append("file", e.target.file.files[0]);
                            formData.append("type", e.target.type.value);

                            api.post('/api/excel/upload', formData, {
                                headers: { 'Content-Type': 'multipart/form-data' }
                            }).then(() => {
                                alert("Upload Successful!");
                                e.target.reset();
                            }).catch((err) => {
                                console.error(err);
                                alert("Upload Failed");
                            });
                        }}>
                            <Row className="align-items-end">
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Select Data Type</Form.Label>
                                        <Form.Select name="type" defaultValue="enquiry">
                                            <option value="enquiry">Enquiries</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Select File</Form.Label>
                                        <Form.Control type="file" name="file" accept=".xlsx, .xls" required />
                                    </Form.Group>
                                </Col>
                                <Col md={4} className="d-flex gap-2">
                                    <Button variant="success" type="submit" className="mb-3">
                                        Upload Data
                                    </Button>
                                    <Button
                                        variant="outline-primary"
                                        className="mb-3"
                                        onClick={() => window.location.href = 'http://localhost:8080/api/excel/download'}
                                    >
                                        Download Sample
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                        <div className="mt-3 text-muted">
                            <small>
                                <strong>Template Format (Enquiry):</strong><br />
                                Column 1: Name | Column 2: Mobile | Column 3: Email | Column 4: Message | Column 5: Course Name
                            </small>
                        </div>
                    </div>
                </Tab>
            </Tabs>
        </Container>
    );
};

export default Masters;
