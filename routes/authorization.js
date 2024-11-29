const express = require('express');
const router = express.Router();
const { verifyToken } = require('../security/security.js');

// Route pour vérifier si l'utilisateur a le rôle d'admin
router.post('/is-granted', verifyToken, async (req, res) => {
    try {
        const result = req.user && req.user.role == "admin";
        return res.status(200).json({ success: true, message: "La requête à réussie", data: result });
    } catch (error) {
        return res.status(500).send({success: false, message: 'Erreur lors de la vérification du rôle.', data: null});
    }
});

module.exports = router;
