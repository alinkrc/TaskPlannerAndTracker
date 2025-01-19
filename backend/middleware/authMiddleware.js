
import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({error: 'Missing token'});
    }

    const token = authHeader; // Directly use the authHeader as the token

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded Token:', decoded);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({error: 'Invalid token'});
    }
};
export default authMiddleware;