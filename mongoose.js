const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const user = new Schema({
  name: String,
  mail: String,
  password: String,
});

const User = model("User", user);

const uri =
  "mongodb+srv://hasinichaithanya04:Mongodb123@cluster0.suc7fzf.mongodb.net/Users";

module.exports = {
  User: User,
  uri: uri,
};
