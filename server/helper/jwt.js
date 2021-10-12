const jwt = require("jsonwebtoken");
const { jwtSecret } = require("./jwtSecret");

exports.decodeToken = (token) => {
  return jwt.decode(token);
};
exports.getJWTToken = (data) => {
  const token = `Bearer${jwt.sign(data, jwtSecret, { expiresIn: "15m" })}`;
  return token;
};

// export { decodeToken, getJWTToken };
