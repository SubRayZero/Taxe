import Link from 'next/link';
import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Nav from 'react-bootstrap/Nav';

export default function Login() {
    const [validated, setValidated] = useState(false);
    const [token, setToken] = useState(null);
    const [taxe, setTaxe] = useState(null);

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

    const handleTaxeSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            try {
                const response = await fetch('/api/taxes/' + form.elements.taxeNumber.value);
                if (!response.ok) {
                    throw new Error('Taxe not found');
                }
                const data = await response.json();
                setTaxe(data);
                setValidated(true);
            } catch (error) {
                console.error('Taxe error:', error);
                setTaxe(null);
                setValidated(true);
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
                    <div>
                        <p>You are logged in!</p>
                    </div>
                    <Row className="justify-content-md-center mb-3">
                        <Form.Group as={Col} md="6" controlId="validationCustomTaxeNumber">
                            <Form.Label>Taxe Number</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter taxe number"
                                required
                                name="taxeNumber"
                            />
                            <Form.Control.Feedback type="invalid">
                                Please enter a valid taxe number.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    <Row className="justify-content-md-center mb-3">
                        <Col md="6" className="text-center">
                            <Button type="submit">Search Taxe</Button>
                        </Col>
                    </Row>
                    {taxe && (
                        <div>
                            <h2>{taxe.title}</h2>
                            <p>{taxe.description}</p>
                            <p>Prix: {taxe.prix} €</p>
                            <p>Date de début: {taxe.date_start.split('T')[0]}</p>
                            <p>Date de fin: {taxe.date_end.split('T')[0]}</p>
                        </div>
                    )}
                    {!taxe && validated && (
                        <p>Taxe not found</p>
                    )}
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
