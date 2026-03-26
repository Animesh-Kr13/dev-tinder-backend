const express = require("express");
const { connectDB } = require("./config/database");
const app = express();
const User = require("./models/user");

app.use(express.json());

//create a user
app.post("/signup", async (req, res) => {
  //creating a new instance of the user model
  let user = new User(req.body);
  try {
    await user.save();
    res.send("User added successfully");
  } catch (err) {
    console.log(err);
    res.status(400).send("Error while creating user " + err.errmsg);
  }
});

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
app.patch("/user/:id", async(req, res) => {
  try {
    let user = await User.findByIdAndUpdate(
      req.params.id, 
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
    res.status(400).send("Update Failed: " + err.errors.properties?.message)
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