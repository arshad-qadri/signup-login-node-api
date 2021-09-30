// const { where } = require("sequelize/types");
const { getJWTToken } = require("../helper/jwt");
const { mail } = require("../helper/nodemailer");
const db = require("../models");
const User = db.users;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  console.log(req.body);
  // if(!req.body)

  const user = {
    first_name: req?.body?.first_name,
    last_name: req?.body?.last_name,
    username: req?.body.username,
    passwords: req?.body.password,
  };
  User.create(user)
    .then((data) => {
      res.send({ data: data, message: "Account created successfully." });
    })
    .catch((err) => {
      res.status(5000).send({
        message: err.message || "Some error occurred while creating the user.",
      });
    });
};

exports.findAll = (req, res) => {
  const first_name = req.query.first_name;
  var condition = first_name
    ? { first_name: { [Op.iLike]: `%${first_name}%` } }
    : null;

  console.log("====res");
  User.findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
};
exports.login = async (req, res) => {
  try {
    const data = await User.findOne({
      where: { username: req.body.username, passwords: req.body.password },
    });
    console.log("=====data", data);
    if (data) {
      const tokens = getJWTToken({ id: data.id, username: req.body.username });

      const token = tokens.replace("Bearer", "");

      console.log("======= token", token);
      return res
        .status(200)
        .json({ data: data, token: token, message: "login successful" });
    } else {
      return res.status(404).json({ message: "username or password wrong" });
    }
  } catch (err) {
    res.status(500).send({
      message: "Some error occurred while retrieving user.",
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    let pass = await User.findOne({ where: { id: req.body.id } });
    console.log(pass);

    if (pass.passwords === req.body.oldPassword) {
      await User.update(
        { passwords: req.body.newPassword },
        {
          where: { id: req.body.id },
        }
      );

      pass = await User.findOne({ where: { id: req.body.id } });

      return res
        .status(200)
        .json({ data: pass, message: "updated successfully" });
    } else {
      return res.status(404).json({ message: "old password not match" });
    }
  } catch (err) {
    res.status(500).send({
      message: "Some error occurred while updating user.",
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    let user = await User.findOne({ where: { id: req.body.id } });
    console.log(user);

    const { username } = user;
    const token = getJWTToken({ id: user.id, username: user.username });

    if (username !== req.body.username) {
      return res.status(404).json({ message: "user not register" });
    } else if (user) {
      const link = `http://localhost:3000/forgot-password?id=${user.id}token=${token}`;
      console.log(link);
      mail("infoqadribags@gmail.com", "pass", link);
      return res
        .status(200)
        .json({ message: "password reset link has been sent" });
    }
  } catch (err) {
    res.status(500).send({ message: err || "some error occured" });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const id = req.params.id;

    if (!req.body.newPassword && !req.body.reEnterPassword) {
      res.status(401).send({ message: "field cannot be empty" });
    } else if (req.body.newPassword === req.body.reEnterPassword) {
      await User.update(
        { passwords: req.body.newPassword },
        { where: { id: id } }
      );
      res.send({ message: "Password changed successfully." });
    } else {
      res.status(404).send({ message: "Password not match" });
    }
  } catch (error) {
    res.status(500).send({ message: error || "Some error occured" });
  }
};
