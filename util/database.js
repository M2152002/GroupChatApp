const Sequelize = require("sequelize");

const dotenv = require('dotenv');
dotenv.config();

const sequelize = new Sequelize('group-chat', 'root', 'MySQL#1234', {
    dialect : 'mysql',
    host : 'localhost'
});

module.exports = sequelize;