const adminAuth = (req, res, next) => {
  let token = "xyz";
  let isAuthorized = token === "xyz"
  if(isAuthorized) {
    console.log("admin authorized");
    next();
  } else {
    res.status(401).send("You are not authorized");
  }
};

const userAuth = (req, res, next) => {
  let token = "xyz";
  let isAuthorized = token === "xyz"
  if(isAuthorized) {
    console.log("user authorized");
    next();
  } else {
    res.status(401).send("You are not authorized");
  }
};

module.exports={
  adminAuth,
  userAuth
};