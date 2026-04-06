let User = require("../models/user");
let jwt = require("jsonwebtoken");

const userAuth = async(req, res, next) => {
  try {
    let { token } = req.cookies;
    if (!token) {
      throw new Error("Invalid token");
    }
    let decodedObj = await jwt.verify(token, "DevTinder@2025");
    let { _id } = decodedObj;
    let user = await User.findById(_id);
    if (!user) {
      throw new Error("User does not exist");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send(err.message)
  }
};

module.exports = {
  userAuth
};