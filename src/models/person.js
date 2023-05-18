const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
const { Schema } = mongoose;

const PersonSchema = new Schema({
  name: String,
  lastName: String,
  phone: String,
  email: String,
  password: String,
});

PersonSchema.methods.encryptPassword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

PersonSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model("Person", PersonSchema);
