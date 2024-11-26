const express = require('express');
const router = express.Router();
const db = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { containsBannedWord, containsSpace, espaceSensibleCharacters } = require('../security/inputSecurity');

// Home route
router.get('/', (req, res) => {
    res.send('<h1>Welcome to Vulnerable App</h1><p>Go to <a href="/login">Login</a></p>');
});

// Login route (vulnerable to SQL Injection) : non plus
router.get('/login', (req, res) => {
    res.send('<form method="post" action="/login"><input name="username" placeholder="Username"/><input type="password" name="password" placeholder="Password"/><button type="submit">Login</button></form>');
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (containsBannedWord(username) || containsBannedWord(password) || containsSpace(username) || containsSpace(password)) {
        return res.status(400).send('Le nom d\'utilisateur ou le mot de passe n\'est pas correct.');
    }
    const query = 'SELECT * FROM users WHERE username = ?';
    db.query(query, [username], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            bcrypt.compare(password, results[0].password, (err, isMatch) => {
                if (err) {
                    return res.status(400).send('Le nom d\'utilisateur ou le mot de passe n\'est pas correct.'); 
                }
                else if (isMatch) {
                    const token = jwt.sign({ id: results[0].id, username: results[0].username }, process.env.JWT_SECRET, { expiresIn: '1h' });
                    res.cookie('token', token, { httpOnly: true, secure: false, sameSite: "strict" });
                    return res.send('Login successful!' );
                } else {
                    return res.send('Invalid credentials!'); 
                }
            });
        } 
    });
});

module.exports = router;
