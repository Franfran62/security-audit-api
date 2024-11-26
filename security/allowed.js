function isAdmin(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).send('Accès interdit: Administrateurs uniquement');
    }
}

module.exports = { isAdmin };