var express = require("express");
var app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
var path = require("path");
var Fingerprint = require("express-fingerprint");
var fs = require("fs");

app.use("/frontend", express.static(path.join(__dirname, "/frontend")));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/frontend/html/index.html");
});

let temp_data = {
  user_details: {},
  user_actions: [],
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
  console.log("from 35");
});

io.on("connection", (socket) => {
  var start_time = new Date();
  let ref_time = start_time;
  temp_data.user_details["start_time"] = ref_time.toString();
  console.log("from 42");

  socket.on("keypress", (action) => {
    temp_data.user_actions.push({
      time: Math.abs(new Date() - ref_time) / 1000,
      action: "send_keys",
      value: action,
    });
    ref_time = new Date();
  });

  socket.on("click", (action) => {
    temp_data.user_actions.push({
      time: Math.abs(new Date() - ref_time) / 1000,
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
    console.log(temp_data);
    fs.writeFile(
      "tmp/" + filename + ".json",
      JSON.stringify(temp_data, null, 2),
      function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("The file was saved!");
        }
      }
    );
  });
});

http.listen(3000, () => {
  console.log("listening on *:3000");
});
