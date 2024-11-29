const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { verifyToken, requestLimiter } = require('../security/security.js');
const { addHebergement, updateHebergement, fetchAllHebergements } = require('../service/hebergementService');
const { entityExists } = require('../security/entitySecurity');
const { isCorrectHebergement } = require('../security/inputSecurity');
const { isAdmin } = require('../security/allowed.js');

router.use(bodyParser.json());

// Route pour ajouter un nouvel hébergement
router.put('/hebergement', verifyToken, isAdmin, requestLimiter, async (req, res) => {
    const hebergementData = req.body;
    if (!isCorrectHebergement(hebergementData)) {
        return res.status(400).json({ success: false, message: 'Données d\'hébergement invalides.', data: null });
    }
    const exists = await entityExists('hebergement', hebergementData);
    if (exists) {
        return res.status(400).json({ success: false, message: 'L\'hébergement existe déjà.', data: null });
    }
    addHebergement(hebergementData.numero, hebergementData.capacite, hebergementData.type, hebergementData.prix_haute_saison, hebergementData.prix_basse_saison)
        .then(result => res.status(201).json({ success: true, message: 'Hébergement ajouté avec succès.', data: result }))
        .catch(err => res.status(400).json({ success: false, message: 'Erreur lors de l\'ajout de l\'hébergement.', data: null }));
});

// Route pour mettre à jour un hébergement existant
router.patch('/hebergement', verifyToken, isAdmin, requestLimiter, async (req, res) => {
    const { id, ...updateData } = req.body;
    if (!isCorrectHebergement({id, ...updateData}, true)) {
        return res.status(400).json({ success: false, message: 'Données d\'hébergement invalides.', data: null });
    }
    const exists = await entityExists('hebergement', { id });
    if (!exists) {
        return res.status(400).json({ success: false, message: 'L\'hébergement n\'existe pas.', data: null });
    }
    updateHebergement(id, updateData)
        .then(result => res.status(200).json({ success: true, message: 'Hébergement mis à jour avec succès.', data: result }))
        .catch(err => res.status(400).json({ success: false, message: 'Erreur lors de la modification de l\'hébergement.', data: null }));
});

// Route pour récupérer tous les hébergements
router.get('/hebergement', verifyToken, requestLimiter, async (req, res) => {
    fetchAllHebergements()
        .then(results => res.status(200).json({ success: true, message: 'Hébergements récupérés avec succès.', data: results }))
        .catch(err => res.status(400).json({ success: false, message: 'Erreur lors de la récupération des hébergements.', data: null }));
});

module.exports = router;