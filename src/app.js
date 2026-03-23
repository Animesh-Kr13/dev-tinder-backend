const express = require("express");

const app = express();

const {adminAuth, userAuth} = require("./middlewares/auth");

app.use("/admin", adminAuth);

app.use("/user/login", (req, res) => {
  console.log("Should not go to authorize");
  res.send("User profile data");
});

app.use("/user", userAuth);

app.use("/admin/getUserData", (req, res) => {
  res.send("User data fetched");
});

app.use("/user/profile", (req, res) => {
  throw new Error("ssdasd");
  res.send("User profile data");
});

app.use("/", (err, req, res, next) => {
  if(err) {
    console.log("here");
    res.status(500).send("Something went wrong");
  }
});

app.listen(3000, () => {
  console.log("Server is listening on port: 3000");
});