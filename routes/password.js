const express = require('express');

const forgotcontroller = require('../controllers/password');

const router = express.Router();

router.get('/login', forgotcontroller.login);

router.post('/forgotpassword', forgotcontroller.forgotpassword)

router.get('/resetpassword/:uuid', forgotcontroller.resetpassword)

router.post('/update', forgotcontroller.updatepassword)


module.exports = router ;