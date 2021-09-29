module.exports = (app) => {
  const Users = require("../controllers/controllers");
  var router = require("express").Router();

  router.get("/", Users.findAll);
  router.post("/create", Users.create);
  router.post("/login", Users.login);
  router.put("/resetPassword", Users.resetPassword);
  router.post("/forgotPassword", Users.forgotPassword);
  app.use("/api/user", router);
};
