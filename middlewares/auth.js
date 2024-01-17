const User = require('../models/userDetails');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

exports.authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization'); 
        if (!token) {
            return res.status(401).json({ success: false, message: 'Token is missing' });
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findByPk(decodedToken.userId);
        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found' });

        }
        req.user = user;
        next();
    } catch (err) {
        console.error(err);
        return res.status(401).json({ success: false, message: 'Invalid token' });
    }
}