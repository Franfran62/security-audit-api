const express = require('express');
const router = express.Router();
const db = require('../config/database');
const bcrypt = require('bcrypt');
const { containsBannedWord, containsSpace } = require('../security/inputSecurity');

// Route pour afficher le formulaire d'inscription
router.get('/register', (req, res) => {
    res.send(`
        <form method="post" action="/register">
            <input name="username" placeholder="Username" required />
            <input type="password" name="password" placeholder="Password" required />
            <button type="submit">Register</button>
        </form>
    `);
});

// Route pour gérer l'inscription (vulnérable à l'injection SQL) : nope hihi
router.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (containsBannedWord(username) || containsBannedWord(password) || containsSpace(username) || containsSpace(password)) {
        return res.status(400).send('Le nom d\'utilisateur ou le mot de passe n\'est pas correct.');
    }
    
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            return res.status(500).send('Une erreur est survenue lors de l\'inscription. Veuillez réessayer plus tard.');
        }
        const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
        db.query(query, [username, hash], (err) => {
            if (err) {
                return res.status(500).send('Une erreur est survenue lors de l\'inscription. Veuillez réessayer plus tard.');
            }
            res.send('Inscription réussie ! Allez à <a href="/login">Connexion</a>');
        });
    });
});

module.exports = router;
