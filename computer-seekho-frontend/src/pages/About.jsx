import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const About = () => {
    return (
        <Container className="mt-4">
            <Row>
                <Col>
                    <h2>About Computer Seekho</h2>
                    <p className="lead">
                        Vidyanidhi’s IT Institute (VITA) brings you Computer Seekho, a premier destination for learning cutting-edge IT skills.
                    </p>
                    <p>
                        Our mission is to provide high-quality education and placement assistance to students, helping them build successful careers in the technology sector.
                    </p>
                    <p>
                        With state-of-the-art infrastructure and experienced faculty, we ensure a holistic learning environment.
                    </p>
                </Col>
            </Row>
        </Container>
    );
};

export default About;
