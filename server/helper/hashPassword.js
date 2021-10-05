const bcrypt = require("bcrypt");

const hashPassword = (passwords, salt) => {
  return bcrypt.hash(passwords, salt);
};

const comparePassword = (passwords, hashPassword) => {
  return bcrypt.compare(passwords, hashPassword);
};

module.exports = { hashPassword, comparePassword };
