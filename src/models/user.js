const mongoose = require("mongoose");
const { Schema } = mongoose;
const validator = require("validator");

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
    },
    lastName: {
      type: String
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if(!validator.isEmail(value)) {
          throw new Error("Invalid email address: " + value);
        }
      }
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if(!validator.isStrongPassword(value)) {
          throw new Error("Enter a strong password: " + value);
        }
      }
    },
    age: {
      type: Number,
      min: 18
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender data is not valid");
        }
      }
    },
    photoUrl: {
      type: String,
      default: "https://p.kindpng.com/picc/s/24-248253_user-profile-default-image-png-clipart-png-download.png",
      validate(value) {
        if(!validator.isURL(value)) {
          throw new Error("Invalid url: " + value);
        }
      }
    },
    about: {
      type: String
    },
    skills: {
      type: [String],
      validate(value){
        if(value.length > 10) {
          throw new Error("Skills cannot be more than 10");
        }
      }
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;