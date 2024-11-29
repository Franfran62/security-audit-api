function isAuthenticated(req, res, next) {
    if (req.user) {
        try {
            const token = req.cookies['auth-token'] ?? false;
            jwt.verify(token, process.env.JWT_SECRET);
            return res.redirect('/'); 
        } catch (err) {
        }
    }
    next();
}

function isAdmin(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).send('Accès interdit: Administrateurs uniquement');
    }
}

module.exports = { isAdmin, isAuthenticated };