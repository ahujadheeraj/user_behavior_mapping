const mongoose = require("mongoose");

const URI =
  "mongodb+srv://dheeraj:admin@cluster0.7mws6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const connectDB = async () => {
  await mongoose.connect(URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  console.log("connected to the database");
};

module.exports = connectDB;
