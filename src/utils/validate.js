const validator = require("validator");

const validateSignUpData = (req) => {
  console.log(req.body);
  const {firstName, lastName, emailId, password} = req.body;

  if(!firstName || !lastName) {
    throw new Error("Enter a valid name");
  } else if(!validator.isEmail(emailId)) {
    throw new Error("Invalid email: " + emailId);
  } else if(!validator.isStrongPassword(password)) {
    throw new Error("Provide a strong password");
  }
};

module.exports={
  validateSignUpData
}