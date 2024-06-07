"use client"

import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Payement from './payement';
import Card from 'react-bootstrap/Card';

export default function Login() {
    const [validated, setValidated] = useState(false);
    const [token, setToken] = useState(null);
    const [taxe, setTaxe] = useState(null);
    const [showPayment, setShowPayment] = useState(false);
    const [userInfo, setUserInfo] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        password: '',
        confirmPassword: '',
    });
    const [formSubmitted, setFormSubmitted] = useState(false); // Nouvelle ligne

    const handleSubmit = async (event) => {
        event.preventDefault();
        setFormSubmitted(true); // Nouvelle ligne
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
        setValidated(true);
    };

    const handleTaxeSubmit = async (event) => {
        event.preventDefault();
        setFormSubmitted(true); // Nouvelle ligne
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/taxes/number/${form.elements.taxeNumber.value}`);
                if (response.ok) {
                    const taxe = await response.json();
                    setTaxe(taxe);
                } else {
                    throw new Error('Taxe not found');
                }
            } catch (error) {
                console.error(error);
                setTaxe(null);
            }
        }
        setValidated(true);
    };

    const handleUserInfoSubmit = async (event) => {
        event.preventDefault();
        setFormSubmitted(true); // Nouvelle ligne
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/users/update', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(userInfo),
                });

                if (!response.ok) {
                    throw new Error('Failed to update user information');
                }
            } catch (error) {
                console.error('Error updating user information:', error);
            }
        }
        setValidated(true);
    };

    const handlePayButtonClick = () => {
        setShowPayment(true);
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
                showPayment ? (
                    <Payement token={token} taxe={taxe} />
                ) : (
                    <div>
                        <Form noValidate onSubmit={handleTaxeSubmit}>
                            <Row className="justify-content-md-center mb-3">
                                <Form.Group as={Col} md="6" controlId="validationCustomTaxeNumber">
                                    <Form.Label>Taxe Number (your number on your paper)</Form.Label>
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
                        </Form>
                        {taxe && (
                            <Card>
                                <Card.Body>
                                    <Card.Title>{taxe.title}</Card.Title>
                                    <Card.Text>{taxe.description}</Card.Text>
                                    <Card.Text>Prix: {taxe.prix} €</Card.Text>
                                    <Card.Text>Date de début: {taxe.date_start.split('T')[0]}</Card.Text>
                                    <Card.Text>Date de fin: {taxe.date_end.split('T')[0]}</Card.Text>
                                    <Button onClick={handlePayButtonClick}>Payer la taxe</Button>
                                </Card.Body>
                            </Card>
                        )}
                    </div>
                )
            ) : (
                <Form noValidate onSubmit={handleSubmit}>
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
