const jwt = require('jsonwebtoken');
const db = require('../config/database');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');

const loginAttempts = {};
const csrfTokens = {}; 
const blacklist = new Set();

function generateCsrfToken() {
    return crypto.randomBytes(32).toString('hex');
}

function verifyToken(req, res, next) {
    try {
        const token = req.cookies['auth-token'] ?? null;
        const csrfToken = req.cookies['csrf-token'] ?? null;
        
        if (!token || !csrfToken || blacklist.has(token)) {
            return res.status(403).send('Accès interdit');
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        getUserByEmail(decoded.email)
            .then(user => {
                if (csrfTokens[user.email] !== csrfToken) {
                    return res.status(403).send('Accès interdit');
                }
                req.user = user;
                next();
            })
            .catch(err => {
                console.log(err);
                return res.status(401).send('Accès interdit');
            });
    } catch (err) {
        console.log(err);
        return res.status(401).send('Accès interdit');
    }
}

function getUserByEmail(email) {
    return new Promise((resolve, reject) => {
        console.log(email);
        const query = 'SELECT * FROM users WHERE email = ?';
        db.query(query, [email], (err, results) => {
            if (err) return reject(err);
            if (results.length > 0) {
                resolve(results[0]);
            } else {
                reject(new Error('Utilisateur non trouvé.'));
            }
        });
    });
}

function limitLoginAttempts(req, res, next) {
    const { username } = req.body;
    const currentTime = Date.now();
    if (!loginAttempts[username]) {
        loginAttempts[username] = { attempts: 1, lastAttempt: currentTime };
    } else {
        const { attempts, lastAttempt } = loginAttempts[username];
        if (currentTime - lastAttempt < 3 * 60 * 1000) { 
            if (attempts >= 5) {
                return res.status(429).send({ success: false, message: 'Trop de tentatives, réessayez dans quelques minutes.', data: null });
            }
            loginAttempts[username].attempts += 1;
        } else {
            loginAttempts[username] = { attempts: 1, lastAttempt: currentTime };
        }
    }
    loginAttempts[username].lastAttempt = currentTime;
    next();
}

function deleteLoginAttempts(username) {
    if (loginAttempts.hasOwnProperty(username)) {
        delete loginAttempts[username]; 
    }
}

function addToBlacklist(token) {
    blacklist.add(token);
}

function isBlacklisted(token) {
    return blacklist.has(token);
}

const requestLimiter = rateLimit({
    windowMs: 5 * 1000, 
    max: 1, 
    keyGenerator: (req) => req.user ? req.user.email : req.ip,
    message: 'Trop de requêtes, veuillez réessayer dans quelques secondes.'
});


module.exports = { verifyToken, generateCsrfToken, limitLoginAttempts, deleteLoginAttempts, requestLimiter, csrfTokens, addToBlacklist, isBlacklisted };