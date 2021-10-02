module.exports = (sequelize, Sequelize) => {
  const Users = sequelize.define("users", {
    first_name: {
      type: Sequelize.STRING,
    },
    last_name: {
      type: Sequelize.STRING,
    },
    username: {
      type: Sequelize.STRING,
    },
    passwords: {
      type: Sequelize.STRING,
    },
  });
  return Users;
};

// module.exports = (sequelize, Sequelize) => {
//   const product = sequelize.define("producted", {
//     first_name: {
//       type: Sequelize.STRING,
//     },
//     last_name: {
//       type: Sequelize.STRING,
//     },
//     username: {
//       type: Sequelize.STRING,
//     },
//     passwords: {
//       type: Sequelize.STRING,
//     },
//   });
//   return product;
// };
