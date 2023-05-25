const express = require("express");
const Router = express.Router();
const Student = require("../models/student");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

const Course = require("../models/Course");
const verifyToken = require("../middleware/verifyToken");

Router.post("/studentregister", (req, res) => {
  let studentname = req.body.name;
  let id = req.body.id;
  let password = req.body.password;

  bcrypt.hash(password, saltRounds).then((hash) => {
    Student.create({
      name: studentname,
      id: id,
      password: hash,
    })
      .then((foundStudent) => {
        const token = jwt.sign({ foundStudent }, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });
        res.json({ message: "You registered and logged in" });
      })
      .catch((e) => {
        res.status(400).json(e.message);
      });
  });
});

Router.post("/studentlogin", (req, res) => {
  const name = req.body.username;
  const password = req.body.password;

  Student.findOne({ name }).then((foundStudent) => {
    if (!foundStudent) {
      res.status(401).json({ message: " Student not Found" });
      return;
    }
    const hash = foundStudent.password;

    bcrypt
      .compare(password, hash)
      .then((response) => {
        if (response == true) {
          const token = jwt.sign({ foundStudent }, process.env.JWT_SECRET, {
            expiresIn: "1h",
          });
          res.json({ student: foundStudent, token: token });
        } else {
          res.status(401).json({ messgae: "Password not correct" });
        }
      })
      .catch((e) => {
        res.send(e.message);
      });
  });
});

Router.post("/Addcourse", verifyToken, (req, res) => {
  let courseid = req.body.courseid;
  let studentid = res.locals.object.foundStudent._id;

  Student.findById(studentid).then((student) => {
    Course.findById(courseid).then((course) => {
      student.course.push(courseid);
      student
        .save()
        .then(() => {
          // Add the student to the course's students array
          course.Student.push(studentid);
          course
            .save()
            .then(() => {
              res.json("Student registered for the course");
            })
            .catch((error) => {
              res.status(500).json(error);
            });
        })
        .catch((error) => {
          res.status(500).json(error);
        });
    });
  });
});

Router.get("/showallcourses", verifyToken, (req, res) => {
  let studentid = res.locals.object.foundStudent._id;

  Student.findById(studentid)
    .populate("course")
    .then((student) => {
      let courseNames = [];

      for (s of student.course) {
        courseNames.push(s.name);
      }

      res.json(courseNames);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

Router.delete("/deletecourse/:courseId", verifyToken, (req, res) => {
  const studentId = res.locals.object.foundStudent._id;
  const courseId = req.params.courseId;

  Student.findById(studentId)
    .populate("course")
    .then((student) => {
      // Find the course
      const courseIndex = student.course.findIndex(
        (course) => course._id.toString() === courseId
      );

      student.course.splice(courseIndex, 1);

      // Save the changes to the student document
      student
        .save()
        .then(() => {
          res.json("Course successfully deleted from student");
        })
        .catch((error) => {
          res.status(500).json(error);
        });
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

module.exports = Router;
