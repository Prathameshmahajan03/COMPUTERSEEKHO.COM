import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Alert } from 'react-bootstrap';

const I18nTest = () => {
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const fetchGreeting = async (lang) => {
        try {
            setError('');
            let url = 'http://localhost:8080/i18n/greet';
            if (lang) {
                url += `?lang=${lang}`;
            }

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            const text = await response.text();
            setMessage(text);
        } catch (err) {
            console.error(err);
            setError(err.message);
            setMessage('');
        }
    };

    // Load default (English) on mount
    useEffect(() => {
        fetchGreeting();
    }, []);

    return (
        <Container className="mt-5">
            <Card>
                <Card.Header as="h3">Internationalization (I18N) Test</Card.Header>
                <Card.Body>
                    <Card.Text>
                        Click the buttons below to switch languages. The text is fetched dynamically from the Backend.
                    </Card.Text>

                    <div className="mb-4">
                        <Button variant="primary" className="me-2" onClick={() => fetchGreeting()}>
                            English
                        </Button>
                        <Button variant="success" onClick={() => fetchGreeting('hi')}>
                            Hindi
                        </Button>
                    </div>

                    {error && <Alert variant="danger">{error}</Alert>}

                    {message && (
                        <Alert variant="info">
                            <strong>Backend Response:</strong> {message}
                        </Alert>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default I18nTest;
