const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();

const { errors } = require("celebrate");

const db = require("./api/models/index");
const { setup } = require("./api/routes/index");
dotenv.config();
db.sequelize.sync();

// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db");
// });

var corsoptions = {
  origin: process.env.APP_URL,
};
app.use(cors(corsoptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// require("./api/routes/routes")(app);
setup(app);
app.use(errors());

app.get("/", (req, res) => {
  try {
    res.json({ message: "Welcome arshad" });
  } catch (err) {
    console.log(err);
  }
});
app.get("/reset-password/:id", (req, res) => {
  try {
    res.send("reset your password here");
  } catch (err) {
    console.log(err);
  }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT} `);
});
