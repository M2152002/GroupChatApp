const { v4: uuidv4 } = require("uuid");
const bcrypt = require('bcrypt');

const User = require('../models/userDetails');
const ForGotPassword = require('../models/forgotPassword');

const Sib = require("sib-api-v3-sdk");
require("dotenv").config();

const client = Sib.ApiClient.instance;
const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.API_KEY;
const tranEmailApi = new Sib.TransactionalEmailsApi();
const sender = {
  email: "1916014@saec.ac.in",
  name: "MAHALAKSHMI G",
};

const path = require("path");

exports.forgot = (req, res, next) => {
  res.sendFile(path.join(__dirname, "../password/forgotPassword.html"));
};

exports.forgotpassword = async (req, res, next) => {
  try {
    const email = req.body.email;
    const users = await User.findAll({ where: { email: email } });
    if (users[0]) {
      const uuid = uuidv4();
      await ForGotPassword.create({ uuid: uuid, userId: users[0].id });
      const recievers = [{ email: email }];
      await tranEmailApi.sendTransacEmail({
        sender,
        to: recievers,
        subject: "link to reset password",
        textContent: `http://localhost:3000/password/resetpassword/{{params.uuid}}`,
        params: { uuid: uuid },
      });
      const link = `http://localhost:3000/password/resetpassword/${uuid}`;
      res.status(200).json({ msg: "email sent to reset password", link: link });
    } else {
      res.status(400).json({ msg: "enter valid email id" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

exports.resetpassword = async (req, res, next) => {
  try {
    const uuid = req.params.uuid;
    const forgotpassword = await ForGotPassword.findOne({
      where: { uuid: uuid, isActive: true },
    });
    console.log("details is ", forgotpassword);
    if (forgotpassword) {
      console.log("in reset fn");
      forgotpassword.update({ isActive: false });
      res.sendFile(path.join(__dirname, "../views/password/updatep.html"));
    } else {
      res.status(400).json({ message: "invalid request" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

exports.updatepassword = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const users = await User.findAll({ where: { email: email } });
    if (users[0]) {
      bcrypt.hash(password, 10, async (err, hash) => {
        await users[0].update({ password: hash });
        console.log("sending update");
        res.status(201).json({ message: "password changed  successfully" });
      });
    } else {
      res.status(400).json({ message: "no such user exists" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

exports.login = (req, res) => {
  res.sendFile(path.join(__dirname, "../views/login/login.html"));
};