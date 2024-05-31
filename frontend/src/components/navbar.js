import React from 'react';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

export default function Navbars() {
    return (
        <Navbar bg="light" data-bs-theme="light">
            <Container>
                <Nav className="me-auto">
                    <Nav.Link as={Link} to="/">Home</Nav.Link>
                    <Nav.Link as={Link} to="/login">Login</Nav.Link>
                    <Nav.Link as={Link} to="/singup">SingUp</Nav.Link>
                    <Nav.Link as={Link} to="/regulation">Regulation</Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    );
}
