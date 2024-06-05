import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

export default function Payement({ token, taxe }) {
    const [validated, setValidated] = useState(false);
    const [card, setCard] = useState({
        number: '',
        crypto: '',
        date_end: ''
    });
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    const handleCardSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            try {
                const saveCardResponse = await fetch('http://127.0.0.1:8000/api/payement', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        taxe_id: taxe.id,
                        number: card.number,
                        crypto: card.crypto,
                        date_end: card.date_end,
                    }),
                });
                if (!saveCardResponse.ok) {
                    throw new Error('Erreur lors de l\'enregistrement de la carte bancaire');
                }

                setPaymentSuccess(true);
            } catch (error) {
                console.error(error);
                alert(error.message);
            }
        }
        setValidated(true);
    };

    return (
        <>
            {paymentSuccess ? (
                <div>
                    <p>La taxe a été payée avec succès!</p>
                </div>
            ) : (
                <Form noValidate validated={validated} onSubmit={handleCardSubmit}>
                    <Form.Group as={Row} controlId="cardNumber">
                        <Form.Label column sm={2}>Numéro de Carte</Form.Label>
                        <Col sm={10}>
                            <Form.Control
                                required
                                type="text"
                                placeholder="Entrez le numéro de carte"
                                value={card.number}
                                onChange={(e) => setCard({ ...card, number: e.target.value })}
                            />
                            <Form.Control.Feedback type="invalid">
                                Veuillez fournir un numéro de carte valide.
                            </Form.Control.Feedback>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="crypto">
                        <Form.Label column sm={2}>Cryptogramme</Form.Label>
                        <Col sm={10}>
                            <Form.Control
                                required
                                type="text"
                                placeholder="Entrez le cryptogramme"
                                value={card.crypto}
                                onChange={(e) => setCard({ ...card, crypto: e.target.value })}
                            />
                            <Form.Control.Feedback type="invalid">
                                Veuillez fournir un cryptogramme valide.
                            </Form.Control.Feedback>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="dateEnd">
                        <Form.Label column sm={2}>Date d'Expiration</Form.Label>
                        <Col sm={10}>
                            <Form.Control
                                required
                                type="month"
                                placeholder="MM/AA"
                                value={card.date_end}
                                onChange={(e) => setCard({ ...card, date_end: e.target.value })}
                            />
                            <Form.Control.Feedback type="invalid">
                                Veuillez fournir une date d'expiration valide.
                            </Form.Control.Feedback>
                        </Col>
                    </Form.Group>
                    <Button type="submit">Payer la Taxe</Button>
                </Form>
            )}
        </>
    );
}
