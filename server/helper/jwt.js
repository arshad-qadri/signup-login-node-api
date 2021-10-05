const jwt = require("jsonwebtoken");
const { jwtSecret } = require("./jwtSecret");

exports.decodeToken = (token) => {
  return jwt.decode(token.replace("Bearer", ""));
};
exports.getJWTToken = (data) => {
  const token = `Bearer${jwt.sign(data, jwtSecret, { expiresIn: "1m" })}`;
  return token;
};

// export { decodeToken, getJWTToken };
