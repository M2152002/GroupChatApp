const Message = require('../models/messages');
const User = require('../models/userDetails');
const sequelize = require('../util/database');
const jwt = require('jsonwebtoken');

const postMessage = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { message} = req.body.message;
    console.log('id>>a>>', req.user.id);
    const data = await Message.create({ message: message,userId:req.user.id }, { transaction: t });
    
    console.log('data>>', data);
    await t.commit();
    const user = await User.findByPk(data.userId);
    console.log(user);
    res.status(200).json({ newMessage: [data], token: generateAccessToken(data.userId, data.message) });
  } catch (err) {
    await t.rollback();
    console.error('Error posting message:', err);
    res.status(500).json({ success: false, error: err.message });
  }
}

function generateAccessToken(id, name) {
  return jwt.sign({ userId: id, name: name },process.env.SECRET_KEY); 
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
    console.log("*******", messages);
    res.status(200).json({ allMessage: messages, success: true });
  } catch (err) {
    console.error('Failed to get messages:', err);
    res.status(500).json({ success: false, error: err.message });
  }
}

 const allMessage = async function (req, res) {
  console.log("bosy of new messages request", req.params);
  let offsetMessageId = req.params.id;
  try {
      const newMessages = await Message.findAll({
          where: {
              id: {
                  [sequelize.Op.gt]: offsetMessageId
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