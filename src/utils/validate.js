const validator = require("validator");

const validateSignUpData = (req) => {
  const {firstName, lastName, emailId, password} = req.body;

  if(!firstName || !lastName) {
    throw new Error("Enter a valid name");
  } else if(!validator.isEmail(emailId)) {
    throw new Error("Invalid email: " + emailId);
  } else if(!validator.isStrongPassword(password)) {
    throw new Error("Provide a strong password");
  }
};

const validateEditProfileData = (req) => {
  const allowedFields = ["firstName", "lastName", "age", "gender", "photoUrl", "about", "skills"];

  let isAllowed = Object.keys(req.body).every(field => allowedFields.includes(field));
  return isAllowed;
}

module.exports={
  validateSignUpData,
  validateEditProfileData
}