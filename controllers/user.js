const User = require('../models/userDetails');
const bcrypt = require('bcrypt');
const saltrounds = 10;

const jwt = require('jsonwebtoken');

const dotenv =  require("dotenv");
dotenv.config();

function isstringinvalid(string){
    if(string == undefined ||string.length === 0){
      return true
    } else {
      return false
    }
}

exports.signup = async (req, res, next) => {
    try{
      const { name, email, phone, password } = req.body;
      console.log('email', email)
      if(isstringinvalid(name) || isstringinvalid(email) || isstringinvalid(phone) || isstringinvalid(password)){
          return res.status(400).json({err: "Bad parameters . Something is missing"})
      }
      bcrypt.hash(password, saltrounds, async (err, hash) => {
          if (err) {
              throw new Error('Error hashing password');
          }
          console.log(err);
          await User.create({ name, email, phone, password: hash })
          res.status(201).json({message: 'Successfuly create new user'})
      })
    }
    catch(err) {
        res.status(500).json({message: err.message});
    }
}

exports.generateAccessToken = (id, name) => {
  return jwt.sign({ userId: id, userName: name}, process.env.JWT_SECRET_KEY);
}

exports.login = async (req, res, next) => {
  try{
  const { email, password } = req.body;
  if(isstringinvalid(email) || isstringinvalid(password)){
      return res.status(400).json({message: 'Email or password is missing ', success: false})
  }
  // console.log(password);
  const user  = await User.findAll({ where : { email }})
      if(user.length > 0){
         bcrypt.compare(password, user[0].password, (err, result) => {
         if(err){
          throw new Error('Something went wrong');
         }
          if(result === true){
              return res.status(200).json({success: true, message: "User logged in successfully", 
              token: exports.generateAccessToken(user[0].id, user[0].name)})
          }
          else{
              return res.status(400).json({success: false, message: 'Password is incorrect'})
         }
      })
      } else {
          return res.status(404).json({success: false, message: 'User Does not exitst'})
      }
  }
  catch(err){
      res.status(500).json({message: err, success: false})
  }
}

exports.guser = async(req,res,next)=>{
    try{
      const data = await User.findAll()
      res.status(200).json({data:data})
    }catch(err){
     console.log(err);
    }
}