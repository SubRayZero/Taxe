"use client"

import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';


export default function Taxe() {
    const [validated, setValidated] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        prix: '',
        datestart: '',
        dateend: '',
        number: '',
    });

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            const requestBody = {
                title: formData.title,
                description: formData.description,
                prix: parseInt(formData.prix, 10),
                datestart: formData.datestart,
                dateend: formData.dateend,
            };

            try {
                const response = await fetch('http://127.0.0.1:8000/api/taxes', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody),
                });

                if (!response.ok) {
                    throw new Error('Erreur de réseau : ' + response.status);
                }

                const data = await response.json();
                console.log(data);
            } catch (error) {
                console.error('There was an error registering the TAXE!', error);
                alert('There was an error registering the TAXE');
            }
        }
        setValidated(true);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    return (
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row className="justify-content-md-center mb-3">
                <Form.Group as={Col} md="6" controlId="validationCustom01">
                    <Form.Label>title</Form.Label>
                    <Form.Control
                        required
                        type="text"
                        placeholder="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                    />
                    <Form.Control.Feedback type="invalid">
                        Please enter your first name.
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" controlId="validationCustom02">
                    <Form.Label>description</Form.Label>
                    <Form.Control
                        required
                        type="text"
                        placeholder="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                    />
                    <Form.Control.Feedback type="invalid">
                        Please enter your last name.
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" controlId="validationCustom02">
                    <Form.Label>prix</Form.Label>
                    <Form.Control
                        required
                        type="prix"
                        placeholder="prix"
                        name="prix"
                        value={formData.prix}
                        onChange={handleInputChange}
                    />
                    <Form.Control.Feedback type="invalid">
                        Please enter your last name.
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" controlId="validationCustom04">
                    <Form.Label>datestart</Form.Label>
                    <Form.Control
                        type="date"
                        placeholder="datestart"
                        name="datestart"
                        value={formData.datestart}
                        onChange={handleInputChange}
                        required
                    />
                    <Form.Control.Feedback type="invalid">
                        Please enter your phone number.
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" controlId="validationCustom04">
                    <Form.Label>dateend</Form.Label>
                    <Form.Control
                        type="date"
                        placeholder="dateend"
                        name="dateend"
                        value={formData.dateend}
                        onChange={handleInputChange}
                        required
                    />

                    <Form.Control.Feedback type="invalid">
                        Please enter your phone number.
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row className="justify-content-md-center mb-3">
                <Col md="6" className="text-center">
                    <Button type="submit">Submit form</Button>
                </Col>
            </Row>
        </Form>
    );
}