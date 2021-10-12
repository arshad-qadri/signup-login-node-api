const {
  create,
  login,
  resetPassword,
  forgotPassword,
  changePassword,
  sendSMS,
  findAll,
  findLoginUser,
  findOne,
} = require("../controllers/controllers");

var router = require("express").Router();

router.get("/", findAll.cotroler);
router.get("/test/:id", findOne.controler);
router.get("/login-user", findLoginUser.controler);
router.post("/create", create.validator, create.controler);
router.post("/login", login.validator, login.controler);
router.put("/resetPassword", resetPassword.validator, resetPassword.controler);
router.post(
  "/forgotPassword",
  forgotPassword.validator,
  forgotPassword.controler
);
router.post(
  "/change-password",
  changePassword.validator,
  changePassword.controler
);

router.post("/sms", sendSMS.validator, sendSMS.controler);

module.exports = router;
