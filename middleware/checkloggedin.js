const checkLoggedIn = (req, res, next) => {
  if (req.session.instructorId) {
    // User is logged in
    next();
  } else {
    // User is not logged in
    res.redirect("/ins/instructorlogin");
  }
};

module.exports = checkLoggedIn;
