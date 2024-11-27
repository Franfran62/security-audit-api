const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { isCorrectReservation, isCorrectEmail } = require('../security/inputSecurity.js');
const { verifyToken, requestLimiter } = require('../security/security.js');
const { isAdmin } = require('../security/allowed.js');
const { addReservation, updateReservation, getReservationsByUser, getReservationsByEmail } = require('../service/reservationService');
const { entityExists } = require('../security/entitySecurity.js');
const { sendWebSocketMessage } = require('../utils/websocket.js');

router.use(bodyParser.json());

// Route pour ajouter une nouvelle réservation
router.put('/reservation', verifyToken, requestLimiter, async (req, res) => {
    const { date_reservation, date_entree, date_sortie, hebergement_id, user_id, nom, prix, solde_restant } = req.body;
    const data = { date_reservation, date_entree, date_sortie, hebergement_id, user_id, nom, prix, solde_restant };
    if (!isCorrectReservation(data)) {
        return res.status(400).send('Les données ne sont pas correctes.');
    }
    const reservationData = { date_reservation, date_entree, date_sortie, hebergement_id, user_id, nom, prix, solde_restant };
    const exists = await entityExists('reservation', reservationData);
    if (exists) {
        return res.status(400).send('La réservation existe déjà.');
    }
    addReservation(date_reservation, date_entree, date_sortie, hebergement_id, user_id, nom, prix, solde_restant)
        .then(result => {
            res.status(201).json(result);
            sendWebSocketMessage({ message: 'Nouvelle réservation ajoutée', reservation: { id: result.id, date_entree, date_sortie, hebergement_id } });
        })
        .catch(err => res.status(400).send('Erreur lors de l\'ajout de la réservation.' + err));
});

// Route pour mettre à jour une réservation existante
router.patch('/reservation', verifyToken, isAdmin, requestLimiter, async (req, res) => {
    const { id, ...updateData } = req.body;
    if (!isCorrectReservation({ id, ...updateData }, true)) {
        return res.status(400).send('Les données ne sont pas correctes.');
    }
    const exists = await entityExists('reservation', { id });
    if (!exists) {
        return res.status(400).send('La réservation n\'existe pas.');
    }
    updateReservation(id, updateData)
        .then(result => {
            res.status(200).json(result);
            if (result.date_entree || result.date_sortie || result.hebergement_id) {
                sendWebSocketMessage({ message: ' Nouvelle réservation modifiée', reservation: { id, ...result } });
            }
        })
        .catch(err => res.status(400).send('Erreur lors de la modification de la réservation.'));
});

// Route pour récupérer les réservations d'un utilisateur
router.post('/reservation', verifyToken, requestLimiter, async (req, res) => {
    const userId = req.user.id;
    try {
        const reservations = await getReservationsByUser(userId);
        res.status(200).json(reservations);
    } catch (err) {
        res.status(400).send('Erreur lors de la récupération des réservations.');
    }
});

// Route pour récupérer les réservations par email (admin uniquement)
router.get('/admin/reservation', verifyToken, isAdmin, requestLimiter, async (req, res) => {
    const { email } = req.query;
    if (!email || !isCorrectEmail(email)) {
        return res.status(400).send('Adresse email manquante ou incorrecte.');
    }
    try {
        const reservations = await getReservationsByEmail(email);
        res.status(200).json(reservations);
    } catch (err) {
        res.status(400).send('Erreur lors de la récupération des réservations.');
    }
});

module.exports = router;
