
const jwt = require('jsonwebtoken');

// Middleware pour valider le JWT
const validateToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).send("Un token est requis pour l'authentification");
    }

    try {
        const decoded = jwt.verify(token, 'azer/123');
        req.user = decoded;
    } catch (err) {
        return res.status(401).send("Token invalide");
    }

    return next();
};

module.exports = validateToken