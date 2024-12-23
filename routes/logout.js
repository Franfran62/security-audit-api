const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { logout } = require('../service/authService');
const { verifyToken } = require('../security/security');
const { closeWebSocketConnection } = require('../utils/websocket');
router.use(bodyParser.json());

// route pour se déconnecter
router.post('/logout', verifyToken, (req, res) => {
    const token = req.headers['auth-token'];
    logout(token)
        .then(() => {
            closeWebSocketConnection(token); 
            res.status(200).json({ success: true, message: 'Déconnexion réussie.', data: null });
        })
        .catch(err => res.status(500).json({ success: false, message: "Impossible de vous déconnecter. Réessayez plus tard ou contactez un administrateur réseau.", data: null }));
});

module.exports = router;
