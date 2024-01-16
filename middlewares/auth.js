const User = require('../models/userDetails');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

exports.authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization'); 
        console.log(token);

        const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const userid = user.id;
        User.findByPk(userid).then((user) => {
            req.user = user;
            next();
        }).catch((err) => {
            throw new Error(err);
        });
    }
    catch(err) {
        res.status(401).send({ message: "token verfication error"}); // Unauthorized response to the client
    }
}