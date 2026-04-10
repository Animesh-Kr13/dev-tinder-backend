const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validate");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Something went wrong", err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth , async (req, res) => {
  try {
    if(!validateEditProfileData) {
      throw new Error("Invalid request, cannot edit user details")
    }
    let loggedUser = req.user;
    Object.keys(req.body).forEach((key) => loggedUser[key] = req.body[key]);
    await loggedUser.save();
    res.json({
      message: "User profile updated",
      data: loggedUser
    })
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
})

module.exports = profileRouter;