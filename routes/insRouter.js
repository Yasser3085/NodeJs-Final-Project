const express = require("express");
const Router = express.Router();

const bcrypt = require("bcrypt");
const saltRounds = 10;

const Instructor = require("../models/instructor");
const Course = require("../models/Course");
const Student = require("../models/student");
const checkLoggedIn = require("../middleware/checkloggedin");

Router.get("/newinstructor", (req, res) => {
  newinstructor = new Instructor({
    name: "ibrahim",
    id: "3983983",
  });
  newinstructor.save().then((i) => {
    res.send("instructor added");
  });
});

Router.get("/newcourse", (req, res) => {
  newcourse = new Course({
    name: "IoT",
    number: "183",
  });
  newcourse.save().then((i) => {
    res.send("course added");
  });
});
Router.get("/newstudent", (req, res) => {
  newstudent = new Student({
    name: "Mohammed",
    id: "28993",
  });

  newstudent.save().then((i) => {
    res.send("student added");
  });
});
Router.get("/allcourses", (req, res) => {
  Course.find()
    .populate("instructor")
    .then((courses) => {
      res.render("courses", { courses });
    });
});

Router.get("/instructorregister", (req, res) => {
  res.render("instructorRegister.ejs");
});
Router.post("/instructorRegister", (req, res) => {
  let instructorname = req.body.instructorname;
  let password = req.body.instructorpassword;

  bcrypt.hash(password, saltRounds).then((hash) => {
    Instructor.create({
      name: instructorname,
      password: hash,
      course: req.body.course,
    }).then((instructor) => {
      res.redirect("/ins/instructorlogin");
    });
  });
});

Router.get("/instructorlogin", (req, res) => {
  res.render("instructorLogin");
});

Router.post("/instructorlogin", (req, res) => {
  const name = req.body.instructorname;
  const password = req.body.instructorpassword;

  Instructor.findOne({ name }).then((foundInstructor) => {
    if (!foundInstructor) {
      res.send("not found");
      return;
    }
    const hash = foundInstructor.password;

    bcrypt
      .compare(password, hash)
      .then((response) => {
        if (response == true) {
          req.session.instructorId = foundInstructor._id;
          // const loggedIn = true;
          // const userName = foundInstructor.name;
          res.redirect("/");
        } else {
          res.send("Password Not Correct");
          s;
        }
      })
      .catch((e) => {
        res.send(e.message);
      });
  });
});

Router.get("/addnewcourse", checkLoggedIn, (req, res) => {
  res.render("newcourseform");
});

Router.post("/addnewcourse", checkLoggedIn, (req, res) => {
  let name = req.body.coursename;
  let number = req.body.coursenumber;
  let hours = req.body.coursehours;
  let level = req.body.courselevel;
  const instructorId = req.session.instructorId;

  Instructor.find({ _id: instructorId }).then((instructor) => {
    let newcourse = new Course({
      name: name,
      number: number,
      hours: hours,
      level: level,
      instructor: instructorId,
      student: req.body.studentid,
    });
    newcourse.save().then((course) => {
      instructor.forEach((instructor) => {
        instructor.course.push(course._id);
        instructor.save().then(() => {
          res.redirect("/ins/listallcourses");
        });
      });
    });
  });
});

Router.get("/listallcourses", checkLoggedIn, (req, res) => {
  const instructorId = req.session.instructorId;

  Instructor.find({ _id: instructorId }).then(() => {
    Course.find({ instructor: instructorId }).then((courses) => {
      res.render("allcourses", { courses });
    });
  });
});

Router.get("/deletecourse/:id", checkLoggedIn, (req, res) => {
  const courseId = req.params.id;

  Course.findByIdAndDelete(courseId).then(() => {
    res.redirect("/ins/listallcourses");
  });
});

Router.get("/editcourse/:id", checkLoggedIn, (req, res) => {
  const courseId = req.params.id;

  Course.findById(courseId).then((course) => {
    res.render("newcourseform", { course });
  });
});

Router.post("/editcourse/:id", checkLoggedIn, (req, res) => {
  const courseId = req.params.id;
  Course.findByIdAndUpdate(courseId).then((course) => {
    course.name = req.body.coursename;
    course.number = req.body.coursenumber;
    course.hours = req.body.coursehours;
    course.level = req.body.courselevel;

    course.save().then(() => {
      res.redirect("/ins/listallcourses");
    });
  });
});

module.exports = Router;
