const passportLocalMongoose = require("passport-local-mongoose"),
  mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  avatar: { type: String, default: "<i class='fas fa-hiking'></i>" },
  firstName: String,
  lastName: String,
  email: String,
  isAdmin: { type: Boolean, default: false },
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
