const { hashPassword, comparePassword } = require("../../helper/hashPassword");
const { getJWTToken, decodeToken } = require("../../helper/jwt");
const { mail } = require("../../helper/nodemailer");
const fast2sms = require("fast-two-sms");
const db = require("../models");
const httpStatus = require("http-status");
const User = db.users;
const Op = db.Sequelize.Op;
const Joi = require("joi");
const { celebrate } = require("celebrate");
const APIResponse = require("../../helper/APIResponse");

// ====================create account ================
const create = {
  validator: celebrate({
    body: Joi.object().keys({
      first_name: Joi.string().required(),
      last_name: Joi.string().required(),
      username: Joi.string().min(3).max(12).required(),
      password: Joi.string().min(6).max(12).required(),
    }),
  }),
  controler: async (req, res) => {
    // console.log(celebrate);

    try {
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
            res
              .status(httpStatus.OK)
              .send({ data: data, message: "Account created successfully." });
          })
          .catch((err) => {
            res.status(httpStatus.BAD_REQUEST).send({
              message:
                err.message || "Some error occurred while creating the user.",
            });
          });
      } else if (alreadyExist.username === req.body.username) {
        res
          .status(httpStatus.BAD_REQUEST)
          .send({ message: "username is already exist" });
      }
    } catch (err) {
      console.log(err);
    }
  },
};

// ================ login ============================
const login = {
  validator: celebrate({
    body: {
      username: Joi.string().required(),
      password: Joi.string().required(),
    },
  }),
  controler: async (req, res) => {
    try {
      const data = await User.findOne({
        where: { username: req.body.username },
      });

      if (!req.body.username || !req.body.password) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ message: "field cannot be empty" });
      }
      // console.log("=====data", data);
      const match = await comparePassword(req.body.password, data.passwords);
      // console.log("match", match);
      if (!match) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ message: "username or password wrong" });
      }
      const tokens = getJWTToken({ id: data.id, username: req.body.username });
      const token = tokens.replace("Bearer", "");

      return res.status(httpStatus.OK).json(
        // { data: data,  message: "Login successful" }
        new APIResponse({ data, token }, "login successful", httpStatus.OK)
      );
    } catch (err) {
      res
        .status(httpStatus.UNAUTHORIZED)
        .json(new APIResponse(null, "login failed", httpStatus.UNAUTHORIZED));
    }
  },
};

// ============== reset password =====================
const resetPassword = {
  validator: celebrate({
    body: {
      oldPassword: Joi.string().min(6).max(12).required(),
      newPassword: Joi.string().min(6).max(12).required(),
    },
  }),
  controler: async (req, res) => {
    try {
      const tokenWithBearer = req.headers.authorization;
      const tokens = tokenWithBearer.replace("Bearer ", "");
      const token = decodeToken(tokens);
      const { id } = token;

      if (token) {
        let pass = await User.findOne({ where: { id: id } });

        const match = await comparePassword(
          req.body.oldPassword,
          pass.passwords
        );

        if (!match) {
          return res
            .status(httpStatus.BAD_REQUEST)
            .json(
              new APIResponse(
                null,
                "old password not match",
                httpStatus.BAD_REQUEST
              )
            );
        } else {
          const hash_Password = await hashPassword(req.body.newPassword, 10);
          await User.update(
            { passwords: hash_Password },
            {
              where: { id: pass.id },
            }
          );
          return res
            .status(httpStatus.OK)
            .json(
              new APIResponse(
                pass,
                "password changed successfully",
                httpStatus.OK
              )
            );
        }
      }
    } catch (err) {
      res
        .status(httpStatus.BAD_REQUEST)
        .json(
          new APIResponse(null, "password at least 6 character", BAD_REQUEST)
        );
    }
  },
};

// ================ forgot password ==================
const forgotPassword = {
  validator: celebrate({
    body: {
      username: Joi.string().required(),
    },
  }),
  controler: async (req, res) => {
    try {
      let user = await User.findOne({ where: { username: req.body.username } });
      console.log(user);

      const tokens = getJWTToken({ id: user.id, username: user.username });
      const token = tokens.replace("Bearer", "");
      // const decodeToken = decodeToken();
      const { username } = user;

      if (username !== req.body.username) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ message: "user not register" });
      } else if (user) {
        const link = `http://localhost:3001/change-password/${token}`;
        console.log(link);
        mail(
          "arshadqadri.7seasol@gmail.com",
          "chnage password using link",
          link
        );
        return res.status(httpStatus.OK).json({
          data: user,
          token: token,
          message: "password reset link has been sent",
        });
      }
    } catch (err) {
      res
        .status(httpStatus.BAD_REQUEST)
        .send({ message: err || "some error occured" });
    }
  },
};

// ============= change password =====================
const changePassword = {
  validator: celebrate({
    body: {
      newPassword: Joi.string().min(6).max(12).required(),
      reEnterPassword: Joi.string().min(6).max(12).required(),
    },
  }),
  controler: async (req, res) => {
    try {
      // const id = req.params.id;
      const tokenWithBearer = req.headers.authorization;
      const tokens = tokenWithBearer.replace("Bearer ", "");
      const token = decodeToken(tokens);
      console.log("=====>", token);
      const { id } = token;
      //  if (!req.body.newPassword && !req.body.reEnterPassword) {
      //    res
      //      .status(httpStatus.BAD_REQUEST)
      //      .json(
      //        new APIResponse(
      //          null,
      //          "field cannot be empty",
      //          httpStatus.BAD_REQUEST
      //        )
      //      );
      //  } else
      if (req.body.newPassword !== req.body.reEnterPassword) {
        res
          .status(httpStatus.BAD_REQUEST)
          .send({ message: "Password not match" });
      } else {
        const hashPass = await hashPassword(req.body.newPassword, 10);
        await User.update({ passwords: hashPass }, { where: { id: id } });
        res
          .status(httpStatus.OK)
          .send({ message: "Password changed successfully." });
      }
    } catch (error) {
      res.status(httpStatus.BAD_REQUEST).json(error);
    }
  },
};

// ============= send message on mobile number =======
const sendSMS = {
  validator: celebrate({
    body: {
      message: Joi.string().required(),
      number: Joi.number().required(),
    },
  }),
  controler: async (req, res) => {
    const response = await fast2sms.sendMessage({
      authorization:
        "LdD8W6w4zjSpnfH0aY1V2o5eJMZbiPEGRN3yUOC9FQhmKxuTvAPs1xhoNMWwnY2d9GIZKuvAjpOqRTrU",
      message: req.body.message,
      numbers: [req.body.number],
    });
    res.send(response);
  },
};

// =================== find all users=================
const findAll = {
  cotroler: (req, res) => {
    const first_name = req.query.first_name;
    var condition = first_name
      ? { first_name: { [Op.iLike]: `%${first_name}%` } }
      : null;

    console.log("====res");
    User.findAll({ where: condition })
      .then((data) => {
        res.status(httpStatus.OK).send(data);
      })
      .catch((err) => {
        res.status(httpStatus.BAD_REQUEST).send({
          message: err.message || "Some error occurred.",
        });
      });
  },
};
// ============== find one user ======================
const findOne = {
  validator: celebrate({
    params: Joi.object().keys({
      id: Joi.string().required(),
    }),
  }),
  controler: async (req, res) => {
    const id = req.params.id;
    console.log(id);
    await User.findOne({
      where: { id: id },
    })
      .then((data) => {
        res.status(httpStatus.OK).send({ data: data });
      })
      .catch((err) => {
        res
          .status(httpStatus.BAD_REQUEST)
          .send({ message: "some error occured", err });
      });
  },
};

// ============== find login user ======================
const findLoginUser = {
  controler: (req, res) => {
    const tokenWithBearer = req.headers.authorization;
    const tokens = tokenWithBearer.replace("Bearer ", "");
    if (tokens) {
      const token = decodeToken(tokens);
      console.log("token", token);
      const { id } = token;
      User.findOne({ where: { id: id } })
        .then((data) => {
          res.status(httpStatus.OK).send({ data: data });
        })
        .catch((err) => {
          res.status(httpStatus.BAD_REQUEST).send({
            message: err.message || "Some error occurred.",
          });
        });
    }
  },
};

module.exports = {
  create,
  login,
  resetPassword,
  forgotPassword,
  changePassword,
  sendSMS,
  findAll,
  findLoginUser,
  findOne,
  // expire,
};
