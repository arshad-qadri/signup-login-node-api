const express = require("express");
const cors = require("cors");
const app = express();

const db = require("./models/index");
const { setup } = require("./routes/index");

db.sequelize.sync();

// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db");
// });

var corsoptions = {
  origin: "http://localhost:3001",
};
app.use(cors(corsoptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// require("./routes/routes")(app);
setup(app);

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

app.listen(3000, () => {
  console.log("server is running on port 3000 ");
});
