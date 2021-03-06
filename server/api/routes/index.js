// const user = require('./routes')
const jwt = require("express-jwt");
const { jwtSecret } = require("../../helper/jwtSecret");
const routes = require("./routes");

exports.setup = (app) => {
  app.use(
    "/api",
    jwt({ algorithms: ["HS256"], secret: jwtSecret }).unless({
      path: [
        "/api/user",
        "/api/user/login",
        "/api/user/create",
        "/api/user/forgotPassword",
        "/api/user/change-password/:id",
      ],
    })
  );

  app.use("/api/user", routes);
};
