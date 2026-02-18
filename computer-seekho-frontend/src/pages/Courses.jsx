import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import api from '../services/api';

const Courses = () => {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await api.get('/course/getAll');
            setCourses(response.data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    return (
        <Container className="mt-4">
            <h2 className="mb-4">Our Courses</h2>
            <Row>
                {courses.map((course) => (
                    <Col md={4} key={course.courseId} className="mb-4">
                        <Card className="h-100 shadow-sm">
                            <Card.Img
                                variant="top"
                                src={course.coverPhoto || '/images/course-default.jpg'}
                                style={{ height: '200px', objectFit: 'cover' }}
                            />
                            <Card.Body>
                                <Card.Title>{course.courseName}</Card.Title>
                                <Card.Text>
                                    {course.courseDescription && course.courseDescription.substring(0, 100)}...
                                </Card.Text>
                                <Card.Text>
                                    <strong>Duration:</strong> {course.courseDuration} Months<br />
                                    <strong>Fee:</strong> ₹{course.courseFee}
                                </Card.Text>
                                {/* <Badge bg={course.courseIsActive ? 'success' : 'secondary'}>
                                    {course.courseIsActive ? 'Active' : 'Inactive'}
                                </Badge> */}
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default Courses;
