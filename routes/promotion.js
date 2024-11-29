const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { verifyToken, requestLimiter } = require('../security/security.js');
const { addPromotion, updatePromotion, fetchAllPromotions } = require('../service/promotionService');
const { entityExists } = require('../security/entitySecurity');
const { isCorrectPromotion } = require('../security/inputSecurity');
const { isAdmin } = require('../security/allowed.js');

router.use(bodyParser.json());

// Route pour ajouter une nouvelle promotion
router.put('/promotion', verifyToken, isAdmin, requestLimiter, async (req, res) => {
    const promotionData = req.body;
    if (!isCorrectPromotion(promotionData)) {
        return res.status(400).json({ success: false, message: 'Données de promotion invalides.', data: null });
    }
    const exists = await entityExists('promotion', promotionData);
    if (exists) {
        return res.status(400).json({ success: false, message: 'La promotion existe déjà.', data: null });
    }
    addPromotion(promotionData.nom, promotionData.remise)
        .then(result => res.status(201).json({ success: true, message: 'Promotion ajoutée avec succès.', data: result }))
        .catch(err => res.status(400).json({ success: false, message: 'Erreur lors de l\'ajout de la promotion.', data: null }));
});

// Route pour mettre à jour une promotion existante
router.patch('/promotion', verifyToken, isAdmin, requestLimiter, async (req, res) => {
    const { id, ...updateData } = req.body;
    if (!isCorrectPromotion({id, ...updateData}, true)) {
        return res.status(400).json({ success: false, message: 'Données de promotion invalides.', data: null });
    }
    const exists = await entityExists('promotion', { id });
    if (!exists) {
        return res.status(400).json({ success: false, message: 'La promotion n\'existe pas.', data: null });
    }
    updatePromotion(id, updateData)
        .then(result => res.status(200).json({ success: true, message: 'Promotion mise à jour avec succès.', data: result }))
        .catch(err => res.status(400).json({ success: false, message: 'Erreur lors de la modification de la promotion.', data: null }));
});

// Route pour récupérer toutes les promotions
router.get('/promotion',verifyToken, requestLimiter, async (req, res) => {
    fetchAllPromotions()
        .then(results => res.status(200).json({ success: true, message: 'Promotions récupérées avec succès.', data: results }))
        .catch(err => res.status(400).json({ success: false, message: 'Erreur lors de la récupération des promotions.', data: null }));
});

module.exports = router;