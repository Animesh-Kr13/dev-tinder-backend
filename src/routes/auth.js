const express = require("express");
const authRouter = express.Router();
const {validateSignUpData} =  require("../utils/validate");
const User = require("../models/user");
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req, res) => {
  //creating a new instance of the user model
  try {
    validateSignUpData(req);
    let { firstName, lastName, emailId, password } = req.body;
    let passwordHash = await bcrypt.hash(password, 10);
    let user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash
    });
    await user.save();
    res.send("User added successfully");
  } catch (err) {
    console.log(err.message);
    res.status(400).send("Error while creating user " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    let { emailId, password } = req.body;
    let user = await User.findOne({ emailId: emailId });
    if (!user) {
      res.status(404).send("Invalid credentials");
    }
    let isCorrect = await user.validatePassword(password);
    if (!isCorrect) {
      res.status(404).send("Invalid credentials");
    }
    let token = await user.getJWT();
    res.cookie("token", token);
    res.send("User authenicated");
  } catch (err) {
    res.status(400).send("Something went wrong", err.message);
  }
});

authRouter.post("/logout", (req, res) => {
  res.cookie("token", null , {
    expires: new Date(Date.now())
  }).send("User logged out succesfully");
})

module.exports = authRouter;