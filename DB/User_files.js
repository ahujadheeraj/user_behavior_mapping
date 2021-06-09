const mongoose = require("mongoose");

const user_files = new mongoose.Schema({
  user_details: {
    type: Object,
  },
  user_actions: {
    type: Array,
  },
});

module.exports = User_files = mongoose.model("user_files", user_files);
