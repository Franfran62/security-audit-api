const jwt = require('jsonwebtoken');
const crypto = require('crypto');

function generateCsrfToken() {
    return crypto.randomBytes(32).toString('hex');
}

function verifyToken(req, res, next) {
    const token = req.cookies.token;
    const csrfToken = req.headers['x-csrf-token'];
    if (!token || !csrfToken) {
        return res.status(403).send('Accès interdit');
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (csrfToken !== req.session.csrfToken) {
            throw new Error('Invalid CSRF token');
        }
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).send('Accès interdit');
    }
}

module.exports = { verifyToken, generateCsrfToken };