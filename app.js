const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const path = require('path');

const cors = require('cors');
app.use(cors({ origin : "*" }));

const sequelize = require('./util/database');

const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/userDetails');
const Message = require('./models/messages');
const Forgotpassword = require('./models/forgotPassword');


const userRoutes = require('./routes/user');
const messageRoutes = require('./routes/messages');
const passwordRoutes = require('./routes/password');



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/user', userRoutes);
app.use('/user', messageRoutes);

// app.use('/password', passwordRoutes);


User.hasMany(Message,{ foreignKey: 'userId'})
Message.belongsTo(User,{ foreignKey: 'userId'})



sequelize.sync().then((result) => {
    app.listen(3000);
}).catch((error) => {
    console.log(error);
});