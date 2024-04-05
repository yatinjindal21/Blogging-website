var express = require("express");
var fileuploader = require("express-fileupload");
var mysql = require("mysql2");

var app = express();

app.listen(2004, function () {
   console.log("server started");
})

app.use(express.static("public"));
app.use(fileuploader());

app.get("/", function (req, resp) {
   resp.sendFile(process.cwd() + "/public/index.html");
})

app.get("/login", function (req, resp) {
   resp.sendFile(process.cwd() + "/public/login.html");
})

app.get("/signup", function (req, resp) {
   resp.sendFile(process.cwd() + "/public/signup.html");
})
