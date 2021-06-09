var express = require("express");
var app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
var path = require("path");
const connectDB = require("./DB/connection");
var Fingerprint = require("express-fingerprint");
var fs = require("fs");
const axios = require("axios");

const port = process.env.PORT || 5000;

app.use("/frontend", express.static(path.join(__dirname, "/frontend")));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/frontend/html/index.html");
});

connectDB();
app.use(express.json({ extended: true }));
app.use("/api/user_files_model", require("./Api/User_files"));

let temp_data = {
  user_details: {}, //object
  user_actions: [], //array
};
let filename = "";

//code for fingerprint
app.use(
  Fingerprint({
    parameters: [
      Fingerprint.useragent,
      Fingerprint.acceptHeaders,
      Fingerprint.geoip,
    ],
  })
);

app.get("*", function (req, res, next) {
  temp_data.user_details.fingerprint = req.fingerprint;
  filename = req.fingerprint.hash;
});

io.on("connection", (socket) => {
  var start_time = new Date();
  let ref_time = start_time;
  temp_data.user_details["start_time"] = ref_time.toString();

  socket.on("keypress", (action) => {
    temp_data.user_actions.push({
      time: Math.abs(new Date() - ref_time),
      action: "send_keys",
      value: action,
    });
    ref_time = new Date();
  });

  socket.on("scroll", (action) => {
    temp_data.user_actions.push({
      time: Math.abs(new Date() - ref_time),
      action: "scroll",
      value: action,
    });
    ref_time = new Date();
  });

  socket.on("click", (action) => {
    temp_data.user_actions.push({
      time: Math.abs(new Date() - ref_time),
      action: "click",
      value: action,
    });
    ref_time = new Date();
  });

  socket.on("window_size", (action) => {
    temp_data.user_details["window_size"] = action;
    console.log("window_size");
  });

  socket.on("window_pos", (action) => {
    temp_data.user_details["window_pos"] = action;
    console.log("window_pos");
  });

  socket.on("disconnect", () => {
    console.log("user disconnected at " + new Date().toString());
    temp_data.user_details["end_time"] = new Date().toString();
    JSON.stringify(temp_data, null, 2),
      //console.log(temp_data);
      axios
        .post("http://" + port + "/api/user_files_model", temp_data)
        .then((res) => console.log("ur file is saved to db...."))
        .catch((err) => console.error(err));

    /*    fs.writeFile(
      "tmp/" + filename + ".json",
      JSON.stringify(temp_data, null, 2),
      function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("The file was saved!");
        }
      }
    );*/
  });
});

http.listen(port, () => {
  console.log("listening on *:5000");
});
