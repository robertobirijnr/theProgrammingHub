const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  Date: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model("categories", CategorySchema);
