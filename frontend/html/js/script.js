var btn = document.querySelector("button");
var bd = document.querySelector("body");

var socket = io();

clickHandler = (e) => {
  e.preventDefault();
  let action = { x: e.clientX, y: e.clientY };
  console.log(action);
  socket.emit("click", action);
};

bd.onload = (e) => {
  console.log("source is " + e.srcElement.URL);
  console.log("destination is " + e.target.URL);
  window_size = {};
  window_size["height"] = window.screen.height;
  window_size["width"] = window.screen.width;
  window_pos = {};
  window_pos["top"] = window.screenY;
  window_pos["left"] = window.screenX;
  console.log(window_pos);
  console.log(window_size);
  socket.emit("window_size", window_size);
  socket.emit("window_pos", window_pos);
};

keypress = (e) => {
  let action = e.key;
  socket.emit("keypress", action);
};

bd.addEventListener("click", clickHandler);
bd.addEventListener("keypress", keypress);

function locationHashChanged(e) {
  console.log(location.hash);
  console.log(e.oldURL, e.newURL);
  alert("hi");
}

window.addEventListener("locationchange", locationHashChanged);

window.onscroll = function () {
  myFunction();
};

function myFunction() {
  let scroll = document.documentElement.scrollTop;
  scroll = Math.floor(scroll);
  let action = "user scrolled the page to " + scroll + " pixels from top";
  if (scroll % 10 === 0) socket.emit("user activity", action);
}
