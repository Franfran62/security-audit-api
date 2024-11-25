const express = require('express');
const router = express.Router();
const db = require('../config/database');

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

// Route pour gérer l'inscription (vulnérable à l'injection SQL)
router.post('/register', (req, res) => {
    const { username, password } = req.body;
    const query = `INSERT INTO users (username, password) VALUES ('${username}', '${password}')`;
    db.query(query, (err) => {
        if (err) throw err;
        res.send('Registration successful! Go to <a href="/login">Login</a>');
    });
});

module.exports = router;
