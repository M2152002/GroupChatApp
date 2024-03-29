const Message = require('../models/messages');
const User = require('../models/userDetails');
const sequelize = require('../util/database');
const jwt = require('jsonwebtoken');

const postMessage = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { message} = req.body.message;
    if (typeof message !== 'string') {
      throw new Error('Invalid message format');
    }
    console.log('id>>a>>', req.user.id);
    const data = await Message.create({ message: message,userId:req.user.id }, { transaction: t });
    await t.commit();
    const user = await User.findByPk(data.userId);
    console.log(user);
    res.status(200).json({ newMessage: [data], token: generateAccessToken(data.userId, data.message) });
  } catch (err) {
    console.error('Error posting message:', err);
    await t.rollback();
    res.status(500).json({ success: false, error: err.message });
  }
}

function generateAccessToken(id, name) {
  return jwt.sign({ userId: id, name: name },process.env.JWT_SECRET_KEY); 
}

const getMessage = async (req, res, next) => {
  try {
    const messages = await Message.findAll({
      include: [
        {
          model: User,
          attribute: ['name'],
        },
      ],
    });
    res.status(200).json({ allMessage: messages, success: true });
  } catch (err) {
    console.error('Failed to get messages:', err);
    res.status(500).json({ success: false, error: err.message });
  }
}

const allMessage = async function (req, res) {
  let messageId = req.params.id;
  try {
      const newMessages = await Message.findAll({
          where: {
              id: {
                  [sequelize.Op.gt]: messageId
              }
          }
      })
      res.status(200).json({ newMessages });
  }
  catch (error) {
      console.log(error);
  }
}

module.exports = {
  postMessage,
  getMessage,
  allMessage
}