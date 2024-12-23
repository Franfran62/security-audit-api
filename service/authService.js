const db = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateCsrfToken, deleteLoginAttempts, csrfTokens, addToBlacklist } = require('../security/security');
require('dotenv').config();

function signin(email, password) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM users WHERE email = ?';
        db.query(query, [email], (err, results) => {
            if (err) return reject(err);
            if (results.length > 0) {
                bcrypt.compare(password, results[0].password, (err, isMatch) => {
                    if (err || !isMatch) {
                        return reject(new Error('L\'adresse email ou le mot de passe n\'est pas correct.'));
                    }
                    const token = jwt.sign({
                        email: email,
                        role: results[0].role
                    }, process.env.JWT_SECRET, { expiresIn: '1h' });

                    const csrfToken = generateCsrfToken();
                    csrfTokens[email] = csrfToken;

                    deleteLoginAttempts(email);
                    resolve({ token, csrfToken, role: results[0].role });
                });
            } else {
                reject(new Error('L\'adresse email ou le mot de passe n\'est pas correct.'));
            }
        });
    });
}

function signup(email, lastname, firstname, password) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) return reject(err);
            const query = 'INSERT INTO users (email, lastname, firstname, password) VALUES (?, ?, ?, ?)';
            db.query(query, [email, lastname, firstname, hash], (err) => {
                if (err) return reject(err);
                signin(email, password)
                    .then(result => resolve(result))
                    .catch(err => reject(err));
            });
        });
    });
}

function logout(token) {
    return new Promise((resolve, reject) => {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            addToBlacklist(token);  
            resolve();
        } catch (err) {
            reject(new Error('Token invalide.'));
        }
    });
}

module.exports = { signin, signup, logout };