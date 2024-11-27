const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { isCorrectEmail, isCorrectPassword, isCorrectString } = require('../security/inputSecurity');
const { limitLoginAttempts, requestLimiter } = require('../security/security');
const { isAuthenticated } = require('../security/allowed');
const { signup } = require('../service/authService');
require('dotenv').config();
router.use(bodyParser.json());

// Route pour l'inscription d'un nouvel utilisateur
router.post('/signup', limitLoginAttempts, requestLimiter, isAuthenticated, (req, res) => {
    const { email, lastname, firstname, password } = req.body;
    if (!isCorrectEmail(email) || !isCorrectPassword(password) || !isCorrectString(lastname) || !isCorrectString(firstname)) {
        return res.status(400).send('Vos informations ne sont pas corrects.');
    }
    signup(email, lastname, firstname, password)
        .then(result => {
            res.json({ token: result.token, csrfToken: result.csrfToken });
        })
        .catch(err => res.status(500).send('Une erreur est survenue lors de l\'inscription. Veuillez réessayer. Si l\'erreur persiste, merci de contacter un administrateur réseau.'));
});

module.exports = router;
