import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

export default function Login() {
    const [validated, setValidated] = useState(false);
    const [token, setToken] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/login_check', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: form.elements.username.value,
                        password: form.elements.password.value
                    }),
                });

                if (!response.ok) {
                    throw new Error('Login failed');
                }

                const data = await response.json();
                if (data.token) {
                    setToken(data.token);
                    setValidated(true);
                    console.log('Token created:', data.token);
                } else {
                    throw new Error('Token not found in response');
                }
            } catch (error) {
                console.error('Login error:', error);
            }
        }
    };


    useEffect(() => {
        if (token) {
            const expirationTime = setTimeout(() => {
                setToken(null);
            }, 3600000);

            return () => clearTimeout(expirationTime);
        }
    }, [token]);

    return (
        <>
            {token ? (
                <div>
                    <p>You are logged in!</p>
                    <p>Your token will expire in 1 hour.</p>
                </div>
            ) : (
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Row className="justify-content-md-center mb-3">
                        <Form.Group as={Col} md="6" controlId="validationCustomEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                required
                                name="username"
                            />
                            <Form.Control.Feedback type="invalid">
                                Please enter a valid email address.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    <Row className="justify-content-md-center mb-3">
                        <Form.Group as={Col} md="6" controlId="validationCustomPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                required
                                name="password"
                            />
                            <Form.Control.Feedback type="invalid">
                                Please enter your password.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    <Row className="justify-content-md-center mb-3">
                        <Col md="6" className="text-center">
                            <Button type="submit">Login</Button>
                        </Col>
                    </Row>
                </Form>
            )}
        </>
    );
}
