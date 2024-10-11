const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const user = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    minLength: [3, "Name should be atleast 3 characters"],
    maxLength: [25, "Name should not exceed 25 characters"],
  },
  mail: {
    type: String,
    required: true,
    validate: {
      validator: function (mail) {
        return mail.match(emailRegex);
      },
      message: "Please provide valid e-mail address",
    },
  },
  password: {
    type: String,
    minLength: [8, "password must be 8 characters long!"],
  },
});

const User = model("User", user);

const uri =
  "mongodb+srv://hasinichaithanya04:Mongodb123@cluster0.suc7fzf.mongodb.net/Users";

module.exports = {
  User: User,
  uri: uri,
};
