const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const app = express();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const dotenv = require("dotenv");
const apiRouter = require("./routes/apiRouter");
const insRouter = require("./routes/insRouter");

const session = require("express-session");
dotenv.config();
app.use(cookieParser());
app.use(
  session({
    secret: "my Secret",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect(process.env.DB_URL).then(() => {
  console.log("connection succeeded");
});

app.set("view engine", "ejs");

const bodyParser = require("body-parser");
const Instructor = require("./models/instructor");
const Course = require("./models/Course");
const Student = require("./models/student");
const { render } = require("ejs");
const { ObjectId } = require("mongodb");
const verifyToken = require("./middleware/verifyToken");
const isloggedin = require("./middleware/isloggedin");
const checkLoggedIn = require("./middleware/checkloggedin");
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api", apiRouter);
app.use("/ins", insRouter);

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.listen(7777, () => {
  console.log("we are listining");
});
