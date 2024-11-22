const { verifyJWToken } = require("../utilities/auth");

const verifyToken = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access Denied. No token provided' });
    }

    try {
        const user = await verifyJWToken(token);
        req.user = user;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid credentials' });
    }
};

module.exports = verifyToken;
