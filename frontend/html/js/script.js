var btn = document.querySelector("button");
var bd = document.querySelector("body");
$(function () {
  var socket = io();
  alert("connected");
  $("form").submit(function (e) {
    e.preventDefault(); // prevents page reloading
    socket.emit("chat message", $("#m").val());
    $("#m").val("");
    return false;
  });
});
clickHandler = (e) => {
  /*console.log(e.originalTarget);
    console.log(e.originalTarget.firstChild.nodeValue)*/
  let action =
    "user clicked on the " +
    e.originalTarget.tagName +
    e.originalTarget.firstChild.nodeValue;
  console.log(action);
};

bd.onload = (e) => {
  console.log("source is " + e.srcElement.URL);
  console.log("destination is " + e.target.URL);
};

keypress = (e) => {
  console.log("keypressed by user " + e.key);
};

bd.addEventListener("click", clickHandler);
bd.addEventListener("keypress", keypress);

function locationHashChanged(e) {
  console.log(location.hash);
  console.log(e.oldURL, e.newURL);
  alert("hi");
}

window.addEventListener("locationchange", locationHashChanged);
