import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
/* Algo de Luhn :
    L'algorithme multiplie par deux un chiffre sur deux, en commençant par l'avant dernier et en se déplaçant de droite à gauche. Si le double d'un chiffre est plus grand que neuf (par exemple 2 × 8 = 16), alors il faut le ramener à un chiffre entre 1 et 9 en prenant son reste dans la division euclidienne par 9. Pour cela, il y a deux manières de faire (pour un résultat identique) :
    Soit on additionne les chiffres composant le double. Dans l'exemple du chiffre 8, 2 × 8 = 16, puis on additionne les chiffres 1 + 6 = 7.
    Soit on soustrait 9 au double. Avec le même exemple, 16 − 9 = 7.
    La somme de tous les chiffres obtenus est effectuée.
    Le résultat est divisé par 10. Si le reste de la division est égal à zéro, alors le nombre original est valide.
    (Wikipedia)

    Pour le code :
    
    - (num + '') : Convertit le numéro de carte en une chaîne de caractères.
    - .split('') : Divise la chaîne en un tableau de caractères.
    - .reverse() : Inverse l'ordre des éléments dans le tableau.
    - .map(x => parseInt(x)) : Convertit chaque caractère en un entier.
    - arr.splice(0, 1) : Supprime et retourne le premier élément du tableau (qui était le dernier chiffre avant l'inversion).*/

export default function Payement({ token, taxe }) {
    const [validated, setValidated] = useState(false);
    const [card, setCard] = useState({
        number: '',
        crypto: '',
        date_end: ''
    });
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    const luhnCheck = (num) => {
        let arr = (num + '')
            .split('')
            .reverse()
            .map(x => parseInt(x));
        let lastDigit = arr.splice(0, 1)[0];
        let sum = arr.reduce(
            (acc, val, i) =>
                i % 2 !== 0
                    ? acc + val
                    : acc + ((val * 2) % 9) || 9,
            0
        );
        sum += lastDigit;
        return sum % 10 === 0;
    };

    const handleCardSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else if (!luhnCheck(card.number)) {
            alert('Numéro de carte invalide selon l\'algorithme de Luhn');
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
