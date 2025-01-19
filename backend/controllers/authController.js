import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from "../models/User.js";

const generateAccessToken = (user) => {
   console.log(user.username);
    return jwt.sign({ id: user.id, role: user.role, username: user.username }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const accessToken = generateAccessToken(user);
        console.log('Access token:', accessToken);
        return res.json({ accessToken });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ error: 'Login failed' });
    }
};

// Export the functions
export {
    login
};