// const jwt = require("jsonwebtoken");
// const Course = require("../models/Course");

// const isloggedin = (req, res, next) => {
//   studentid = res.locals.object.foundStudent._id;
//   courseid = req.body.courseid;

//   Course.findById(courseid).then((course) => {
//     if (course.student == studentid) {
//       res.locals.course = c;

//       next();
//     } else {
//       res.status(400).json({ message: " you are not allowed " });
//     }
//   });
// };

// module.exports = is;
