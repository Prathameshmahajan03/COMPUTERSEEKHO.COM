import React, { useEffect, useState, useContext } from 'react';
import { Container, Card, Row, Col, Carousel } from 'react-bootstrap';
import api from '../services/api';
import { LanguageContext } from '../context/LanguageContext';

const Home = () => {
    const [news, setNews] = useState(null);
    const { labels } = useContext(LanguageContext);

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            const response = await api.get('/News/latest');
            console.log("News Data:", response.data);
            if (response.status === 200 && response.data) {
                // Handle both single object and array
                const data = Array.isArray(response.data) ? response.data[0] : response.data;
                setNews(data);
            } else {
                setNews(null);
            }
        } catch (error) {
            console.error('Error fetching news:', error);
            // Visual Error for Debugging
            setNews({ newsTitle: "Debug Error", newsDescription: error.message || "Network Failed" });
        }
    };

    return (
        <Container className="mt-4">
            <div className="jumbotron p-5 mb-4 bg-light rounded-3">
                <h1>{labels['home.welcome'] || "Welcome to Computer Seekho"}</h1>
                <p className="lead">{labels['home.subtitle'] || "Empowering you with the best IT skills for a brighter future."}</p>
                <hr className="my-4" />
                <p>{labels['home.explore'] || "Explore our courses and start your journey today."}</p>
            </div>

            <div className="mb-5">
                <h3 className="mb-3">{labels['home.announcement'] || "Latest Announcement"}</h3>
                {news && news.newsTitle ? (
                    <div className="alert alert-info overflow-hidden">
                        <marquee behavior="scroll" direction="left" scrollamount="10">
                            <strong>{news.newsTitle}:</strong> {news.newsDescription}
                        </marquee>
                    </div>
                ) : (
                    <p>{labels['home.no_announcement'] || "No announcements at the moment."}</p>
                )}
            </div>

            <h3 className="mb-3">{labels['home.campus'] || "Campus Life"}</h3>
            <Carousel>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src="/images/campus-1.jpg"
                        alt="First slide"
                        style={{ height: '400px', objectFit: 'cover' }}
                    />
                    <Carousel.Caption>
                        <h3>{labels['home.labs'] || "State of the Art Labs"}</h3>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src="/images/campus-2.jpg"
                        alt="Second slide"
                        style={{ height: '400px', objectFit: 'cover' }}
                    />
                    <Carousel.Caption>
                        <h3>{labels['home.community'] || "Vibrant Student Community"}</h3>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>
        </Container>
    );
};

export default Home;
