const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { isCorrectPassword, isCorrectEmail } = require('../security/inputSecurity');
const { limitLoginAttempts, requestLimiter } = require('../security/security');
const { isAuthenticated } = require('../security/allowed');
const { signin, isBlacklisted } = require('../service/authService');
router.use(bodyParser.json());

// Route pour la connexion d'un utilisateur
router.post('/signin', isAuthenticated, limitLoginAttempts, requestLimiter, (req, res) => {
    const { email, password } = req.body;
    if (!isCorrectEmail(email) || !isCorrectPassword(password)) {
        return res.status(400).send('L\'adresse email ou le mot de passe n\'est pas correct.');
    }
    signin(email, password)
        .then(result => {
            if (isBlacklisted(result.token)) {
                return res.status(401).send('Il y a eu une erreur. Merci de contacter un administrateur réseau');
            }
            res.json({ token: result.token, csrfToken: result.csrfToken });
        })
        .catch(err => res.status(400).send('L\'adresse email ou le mot de passe n\'est pas correct.'));
});

module.exports = router;
