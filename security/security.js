const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');

const loginAttempts = {};

function generateCsrfToken() {
    return crypto.randomBytes(32).toString('hex');
}

function verifyToken(req, res, next) {
    const token = req.cookies.token;
    const csrfToken = req.cookies.csrfToken;
    if (!token || !csrfToken) {
        return res.status(403).send('Accès interdit');
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (csrfToken !== req.session.csrfToken) {
            throw new Error('Invalid CSRF token');
        }
        req.user = decoded;
        req.user.role = decoded.role; 
        next();
    } catch (err) {
        return res.status(401).send('Accès interdit');
    }
}

function limitLoginAttempts(req, res, next) {
    const { username } = req.body;
    const currentTime = Date.now();
    if (!loginAttempts[username]) {
        loginAttempts[username] = { attempts: 1, lastAttempt: currentTime };
    } else {
        const { attempts, lastAttempt } = loginAttempts[username];
        if (currentTime - lastAttempt < 5 * 60 * 1000) { 
            if (attempts >= 5) {
                return res.status(429).send('Trop de tentatives de connexion. Veuillez réessayer plus tard.');
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

const commentLimiter = rateLimit({
    windowMs: 5 * 1000, 
    max: 1, 
    message: 'Trop de requêtes, veuillez réessayer après 10 secondes.'
});

module.exports = { verifyToken, generateCsrfToken, limitLoginAttempts, deleteLoginAttempts, commentLimiter };