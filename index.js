var express = require("express");
var app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
var path = require("path");
var Fingerprint = require("express-fingerprint");
var fs = require("fs");
const expressip = require("express-ip");

app.use("/frontend", express.static(path.join(__dirname, "/frontend")));
app.use(expressip().getIpInfoMiddleware);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/frontend/html/index.html");
});
app.use(
  Fingerprint({
    parameters: [
      // Defaults
      Fingerprint.useragent,
      Fingerprint.acceptHeaders,
      Fingerprint.geoip,
    ],
  })
);

app.get("*", function (req, res, next) {
  // Fingerprint object
  console.log(req.fingerprint);
  console.log(req.ipInfo);
  let myfiledata = req.fingerprint;

  let ipAdd = req.ipInfo.ip;
  if (ipAdd == "::1") {
    ipAdd = "localhost";
  } else {
    fs.writeFile(
      "tmp/" + ipAdd + "->" + req.fingerprint.hash + ".txt",
      JSON.stringify(req.fingerprint, null, 2),
      function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("The file was saved!");
        }
      }
    );
  }
});

io.on("connection", (socket) => {
  console.log(".......connection established........");
  socket.on("user activity", (action) => {
    console.log("Action: " + action);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

http.listen(3000, () => {
  console.log("listening on *:3000");
});
