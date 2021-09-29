const jwt = require("jsonwebtoken");
const { jwtSecret } = require("./jwtSecret");

exports.decodeToken = (token) => {
  return jwt.decode(token.replace("Bearer", ""));
};
exports.getJWTToken = (data) => {
  const token = `${jwt.sign(data, jwtSecret, { expiresIn: "15m" })}`;
  return token;
};

// export { decodeToken, getJWTToken };
