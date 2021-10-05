const Users = require("../controllers/controllers");
var router = require("express").Router();

router.get("/", Users.findAll);
router.get("/:id", Users.findOne);
router.post("/create", Users.create);
router.post("/login", Users.login);
router.put("/resetPassword", Users.resetPassword);
router.post("/forgotPassword", Users.forgotPassword);
router.post("/change-password/:id", Users.changePassword);

module.exports = router;
