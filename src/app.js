const express = require("express");
const { connectDB } = require("./config/database");
const app = express();
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validate");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(cookieParser());

//create a user
app.post("/signup", async (req, res) => {
  //creating a new instance of the user model
  try {
    validateSignUpData(req);
    let {firstName, lastName, emailId, password} = req.body;
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

//login
app.post("/login", async (req, res) => {
  try {
    let {emailId, password} = req.body;
    let user = await User.findOne({ emailId: emailId });
    if (!user) {
      res.status(404).send("Invalid credentials");
    }
    let isCorrect = await bcrypt.compare(password, user?.password);
    if(!isCorrect) {
      res.status(404).send("Invalid credentials");
    }
    let token = await jwt.sign({_id: user._id}, "DevTinder@2025");
    res.cookie("token", token);
    res.send("User authenicated");
  } catch (err) {
    res.status(400).send("Something went wrong", err.message);
  }
});

//profile
app.get("/profile", async(req, res) => {
  try {
    let cookie = req.cookies
    let {token} = cookie;
    let info = await jwt.verify(token, "DevTinder@2025");
    let user = await User.findOne({_id: info});
    if(user) {
      res.send(user)
    } else {
      throw new Error("User does not exist");
    }
  } catch (err) {
    res.status(400).send("Something went wrong", err.message);
  }
})

//find a user
app.get("/user", async (req, res) => {
  let userEmail = req.body.emailId;
  try {
    let user = await User.findOne({ emailId: userEmail });
    if (user) {
      res.send(user);
    } else {
      res.status(404).send("Data not found");
    }
  } catch (err) {
    res.status(400).send("Something went wrong", err.message);
  }
});

//get all users
app.get("/feed", async (req, res) => {
  try {
    let users = await User.find({});
    if (users.length) {
      res.send(users);
    } else {
      res.status(404).send("Data not found");
    }
  } catch (err) {
    res.status(400).send("Something went wrong", err.message);
  }
});

//update user
app.patch("/user/:id", async (req, res) => {
  let userId = req.params?.id;
  let data = req.body;

  try {
    const ALLOWED_UPDATES = ["photoUrl", "age", "about", "gender", "skills"];

    const isUpdateAllowed = Object.keys(data).every(key => ALLOWED_UPDATES.includes(key));

    if(!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }

    let user = await User.findByIdAndUpdate(
      userId,
      { $set: req.body },
      {
        after: true,
        runValidators: true,
      }
    );
    res.send({
      data: user,
      message: "User updated successfully"
    })
  } catch (err) {
    console.log(err.message)
    res.status(400).send("Update Failed: " + err.message)
  }
});

connectDB()
  .then(res => {
    console.log("Database connection eastablished...")
    app.listen(3000, () => {
      console.log("Server is listening on port: 3000..");
    });
  })
  .catch(err => console.log(err));