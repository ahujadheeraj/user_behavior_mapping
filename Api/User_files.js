const express = require("express");
const mongoose = require("mongoose");
const User_files = require("../DB/User_files");
const route = express.Router();

route.post("/", async (req, res) => {
  const { user_details, user_actions } = req.body;
  let user_files = {};
  user_files.user_details = user_details;
  user_files.user_actions = user_actions;
  let user_files_model = new User_files(user_files);
  await user_files_model.save();
  res.json(user_files_model);
});

module.exports = route;
