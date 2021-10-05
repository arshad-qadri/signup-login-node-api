// const { where } = require("sequelize/types");
const { hashPassword, comparePassword } = require("../helper/hashPassword");
const { getJWTToken, decodeToken } = require("../helper/jwt");
const { mail } = require("../helper/nodemailer");
const db = require("../models");
const User = db.users;
const Op = db.Sequelize.Op;

// ====================create account ================
exports.create = async (req, res) => {
  const alreadyExist = await User.findOne({
    where: { username: req.body.username },
  });
  console.log(alreadyExist);
  if (!alreadyExist) {
    let newPassword = await hashPassword(req.body.password, 12);
    // let ok = newPassword.toString();
    const user = {
      first_name: req?.body?.first_name,
      last_name: req?.body?.last_name,
      username: req?.body.username,
      passwords: newPassword,
    };
    await User.create(user)
      .then((data) => {
        res.send({ data: data, message: "Account created successfully." });
      })
      .catch((err) => {
        res.status(5000).send({
          message:
            err.message || "Some error occurred while creating the user.",
        });
      });
  } else if (alreadyExist.username === req.body.username) {
    res.status(404).send({ message: "username is already exist" });
  }
};

// =================== find all users=================
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
        message: err.message || "Some error occurred.",
      });
    });
};

// ============== find one user =====================
exports.findOne = (req, res) => {
  const id = req.params.id;
  User.findOne({ where: { id: id } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred.",
      });
    });
};

// ================ login =====================
exports.login = async (req, res) => {
  try {
    const data = await User.findOne({
      where: { username: req.body.username },
    });

    if (!req.body.username || !req.body.password) {
      return res.status(404).json({ message: "field cannot be empty" });
    } else if (!data) {
      return res.status(404).json({ message: "username or password wrong" });
    }
    console.log("=====data", data);
    const match = await comparePassword(req.body.password, data.passwords);
    console.log("match", match);
    if (!match) {
      return res.status(404).json({ message: "username or password wrong" });
    }
    const tokens = getJWTToken({ id: data.id, username: req.body.username });
    const token = tokens.replace("Bearer", "");

    return res
      .status(200)
      .json({ data: data, token: token, message: "Login successful" });
  } catch (err) {
    res.status(500).send({
      message: "Some error occurred while retrieving user.",
    });
  }
};

// ============== reset password =================
exports.resetPassword = async (req, res) => {
  try {
    let pass = await User.findOne({ where: { id: req.body.id } });
    console.log("=====user", pass);

    const match = await comparePassword(req.body.oldPassword, pass.passwords);

    if (!match) {
      return res.status(200).json({ message: "old password not match" });

      // pass = await User.findOne({ where: { id: req.body.id } });
    } else {
      const test = await hashPassword(req.body.newPassword, 10);
      await User.update(
        { passwords: test },
        {
          where: { id: pass.id },
        }
      );
      return res
        .status(200)
        .json({ data: pass, message: "updated successfully" });
    }
  } catch (err) {
    res.status(500).send({
      message: "Some error occurred while updating user.",
    });
  }
};

// ================forgot password ====================
exports.forgotPassword = async (req, res) => {
  try {
    let user = await User.findOne({ where: { username: req.body.username } });
    console.log(user);

    const tokens = getJWTToken({ id: user.id, username: user.username });
    const token = tokens.replace("Bearer", "");
    const { username } = user;

    if (username !== req.body.username) {
      return res.status(404).json({ message: "user not register" });
    } else if (user) {
      const link = `http://localhost:3001/change-password/${user.id}/${token}`;
      console.log(link);
      mail("arshadqadri321@gmail.com", "chnage password using link", link);
      return res.status(200).json({
        data: user,
        token: token,
        message: "password reset link has been sent",
      });
    }
  } catch (err) {
    res.status(500).send({ message: err || "some error occured" });
  }
};

// ============= change password ========================
exports.changePassword = async (req, res) => {
  try {
    const id = req.params.id;

    if (!req.body.newPassword && !req.body.reEnterPassword) {
      res.status(401).send({ message: "field cannot be empty" });
    } else if (req.body.newPassword !== req.body.reEnterPassword) {
      res.status(404).send({ message: "Password not match" });
    } else {
      const hashPass = await hashPassword(req.body.newPassword, 10);
      await User.update({ passwords: hashPass }, { where: { id: id } });
      res.send({ message: "Password changed successfully." });
    }
  } catch (error) {
    res.status(500).send({ message: error || "Some error occured" });
  }
};
