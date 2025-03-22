const mongoose = require("mongoose");

const Form = require("../models/FormModel");


const FormSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  gender: String,
  email: String,
  phone: String,
  location: String,
  profession: String,
  salary: Number,
  skill: String,
  resume: String, // File path
  remark: String,
});

module.exports = mongoose.model("Form", FormSchema);
