const express = require('express');

const router = express.Router();

const messageController = require('../controllers/messages');
const msgAuth = require('../middlewares/auth');

router.post('/message',msgAuth.authenticate,messageController.postMessage);
router.get('/getmessages',msgAuth.authenticate,messageController.getMessage);
router.get('/allMessages/:id',msgAuth.authenticate, messageController.allMessage);


module.exports = router;