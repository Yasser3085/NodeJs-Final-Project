const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ error: "unauthorized :(" });
  }

  const token = req.headers.authorization.split(" ")[1];

  try {
    const object = jwt.verify(token, process.env.JWT_SECRET);
    res.locals.object = object;
    next();
  } catch (err) {
    res.status(401).json("error");
  }
};


module.exports = verifyToken;