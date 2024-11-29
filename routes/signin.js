const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { isCorrectPassword, isCorrectEmail } = require('../security/inputSecurity');
const { limitLoginAttempts, requestLimiter, isBlacklisted } = require('../security/security');
const { isAuthenticated } = require('../security/allowed');
const { signin } = require('../service/authService');
router.use(bodyParser.json());

// Route pour la connexion d'un utilisateur
router.post('/signin', isAuthenticated, limitLoginAttempts, requestLimiter, (req, res) => {
    const { email, password } = req.body;
    if (!isCorrectEmail(email) || !isCorrectPassword(password)) {
        return res.status(400).json({ success: false, message: 'L\'adresse email ou le mot de passe n\'est pas correct.', data: null });
    }
    signin(email, password)
        .then(result => {
            if (isBlacklisted(result.token)) {
                return res.status(401).json({ success: false, message: 'Il y a eu une erreur. Merci de contacter un administrateur réseau', data: null });
            }
            // Si les cookies existent déjà, ils seront remplacés par les nouvelles valeurs
            res.cookie('auth-token', result.token, { httpOnly: true, secure: false }); // secure à true pour HTTPS
            res.cookie('csrf-token', result.csrfToken, { httpOnly: true, secure: false }); // secure à true pour HTTPS
            res.json({ success: true, message: "Connexion réussie.", data: result.role });
        })
        .catch(err => res.status(400).json({ success: false, message: 'L\'adresse email ou le mot de passe n\'est pas correct.', data: null }));
});

module.exports = router;
