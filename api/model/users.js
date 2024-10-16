const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: {
    type: String,
    require: true,
    unique: true,
    match:
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
  },
  password: {
    type: String,
    require: true,
  },
  fullName: {
    type: String,
  },
  class: { type: Number },
  imageUrl: { type: String },
  courses: { type: Array },
  paidSchoolFees: { type: Boolean },
  dateRegistered: { type: Date },
  resetToken:{type:String},
  role: {type:String,
  enum: ["Prefect","Normal"],
  default: "Normal",
  }
});
module.exports = mongoose.model("User", userSchema);
