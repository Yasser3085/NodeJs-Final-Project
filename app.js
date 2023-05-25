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

// app.get("/newinstructor", (req, res) => {
//   newinstructor = new Instructor({
//     name: "ibrahim",
//     id: "3983983",
//   });
//   newinstructor.save().then((i) => {
//     res.send("instructor added");
//   });
// });

// app.get("/newcourse", (req, res) => {
//   newcourse = new Course({
//     name: "IoT",
//     number: "183",
//   });
//   newcourse.save().then((i) => {
//     res.send("course added");
//   });
// });
// app.get("/newstudent", (req, res) => {
//   newstudent = new Student({
//     name: "Mohammed",
//     id: "28993",
//   });

//   newstudent.save().then((i) => {
//     res.send("student added");
//   });
// });
// app.get("/allcourses", (req, res) => {
//   Course.find()
//     .populate("instructor")
//     .then((courses) => {
//       res.render("courses", { courses });
//     });
// });

// app.get("/instructorregister", (req, res) => {
//   res.render("instructorRegister.ejs");
// });
// app.post("/instructorRegister", (req, res) => {
//   let instructorname = req.body.instructorname;
//   let password = req.body.instructorpassword;

//   bcrypt.hash(password, saltRounds).then((hash) => {
//     Instructor.create({
//       name: instructorname,
//       password: hash,
//       course: req.body.course,
//     }).then((instructor) => {
//       res.redirect("/instructorlogin");
//     });
//   });
// });

// app.get("/instructorlogin", (req, res) => {
//   res.render("instructorLogin");
// });

// app.post("/instructorlogin", (req, res) => {
//   const name = req.body.instructorname;
//   const password = req.body.instructorpassword;

//   Instructor.findOne({ name }).then((foundInstructor) => {
//     if (!foundInstructor) {
//       res.send("not found");
//       return;
//     }
//     const hash = foundInstructor.password;

//     bcrypt
//       .compare(password, hash)
//       .then((response) => {
//         if (response == true) {
//           req.session.instructorId = foundInstructor._id;
//           // const loggedIn = true;
//           // const userName = foundInstructor.name;
//           res.redirect("/");
//         } else {
//           res.send("Password Not Correct");
//           s;
//         }
//       })
//       .catch((e) => {
//         res.send(e.message);
//       });
//   });
// });

// app.get("/addnewcourse", checkLoggedIn, (req, res) => {
//   res.render("newcourseform");
// });

// app.post("/addnewcourse", checkLoggedIn, (req, res) => {
//   let name = req.body.coursename;
//   let number = req.body.coursenumber;
//   let hours = req.body.coursehours;
//   let level = req.body.courselevel;
//   const instructorId = req.session.instructorId;

//   Instructor.find({ _id: instructorId }).then((instructor) => {
//     let newcourse = new Course({
//       name: name,
//       number: number,
//       hours: hours,
//       level: level,
//       instructor: instructorId,
//       student: req.body.studentid,
//     });
//     newcourse.save().then((course) => {
//       instructor.forEach((instructor) => {
//         instructor.course.push(course._id);
//         instructor.save().then(() => {
//           res.redirect("/listallcourses");
//         });
//       });
//     });
//   });
// });

// app.get("/listallcourses", checkLoggedIn, (req, res) => {
//   const instructorId = req.session.instructorId;

//   Instructor.find({ _id: instructorId }).then(() => {
//     Course.find({ instructor: instructorId }).then((courses) => {
//       res.render("allcourses", { courses });
//     });
//   });
// });

// app.get("/deletecourse/:id", checkLoggedIn, (req, res) => {
//   const courseId = req.params.id;

//   Course.findByIdAndDelete(courseId).then(() => {
//     res.redirect("/listallcourses");
//   });
// });

// app.get("/editcourse/:id", checkLoggedIn, (req, res) => {
//   const courseId = req.params.id;

//   Course.findById(courseId).then((course) => {
//     res.render("newcourseform", { course });
//   });
// });

// app.post("/editcourse/:id", checkLoggedIn, (req, res) => {
//   const courseId = req.params.id;
//   Course.findByIdAndUpdate(courseId).then((course) => {
//     course.name = req.body.coursename;
//     course.number = req.body.coursenumber;
//     course.hours = req.body.coursehours;
//     course.level = req.body.courselevel;

//     course.save().then(() => {
//       res.redirect("/listallcourses");
//     });
//   });
// });

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.listen(7777, () => {
  console.log("we are listining");
});
