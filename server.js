var express = require("express");
var fileuploader = require("express-fileupload");
var mysql = require("mysql2");

var app = express();
exports.app = app;

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

app.get("/home", function (req, resp) {
   resp.sendFile(process.cwd() + "/public/home.html");
})

app.get("/create-blog", function (req, resp) {
   resp.sendFile(process.cwd() + "/public/create-blog.html");
})


app.get("/display-blogs", function (req, resp) {
   resp.sendFile(process.cwd() + "/public/display-blogs.html");
})

//---------------------------DB Operations-------------------
//================Database Connectivity============
var dbConfig = {
   host: "127.0.0.1",
   user: "root",
   password: "Jindal@2004",
   database: "youandme",
   dateStrings: true
}

var dbCon = mysql.createConnection(dbConfig);
dbCon.connect(function (err) {
   if (err == null)
      console.log("Connected Successfulllyyy...");
   else
      console.log(err);
})

app.use(express.urlencoded(true));


//-------------------------------------------- SIGN-UP ===========================================

app.get("/signup-user", function (req, resp) {

   var email = req.query.kuchEmail;
   var firstname = req.query.kuchFname;
   var lastname = req.query.kuchLname;
   var username = req.query.kuchUname;
   var password = req.query.kuchPwd;
   var phoneno = req.query.kuchPhoneno;
   var ppic = null;

   var name = firstname + " " + lastname;

   dbCon.query("insert into users values(?,?,?,?,?,?,current_date())", [email, password, username, name, phoneno, ppic], function (err) {
      console.log(err);
      if (err == null) {
         resp.send("done");
      }
      else {
         resp.send(err.toString());
      }
   })
})

//---------------------------------------------- LOGIN ====================================================

app.get("/login-user", function (req, resp) {
   var email = req.query.kuchEmail;
   var password = req.query.kuchPwd;

   dbCon.query("select * from users where email=? or username=?", [email, email], function (err, resultTable) {
      if (err == null) {

         if (resultTable.length == 1) {

            if (resultTable[0].password == password) {
               resp.send(resultTable[0].type);
            }
            else
               resp.send("(Incorrect Password)");
         }
         else
            resp.send("(Invalid User-ID)");
      }
      else {
         resp.send(err.toString());
      }
   })
})

//--------------------- email-existance =======================

app.get("/chk-email", function (req, resp) {

   var email = req.query.kuchEmail;

   dbCon.query("select * from users where email=?", [email], function (err, resultTable) {
      if (err == null) {
         if (resultTable.length == 1) {
            resp.send("(Already exists)");
         }
         else if (email == "")
            resp.send("(Fill the Email-Id)");
      }
      else {
         resp.send(err.toString());
      }
   })
})

//------------------------------ POST-BLOG ==================================

app.post("/post-blog", function (req, resp) {

   var fileName = "nopic.jpg";
   if (req.files != null) {
      //console.log(process.cwd());
      fileName = req.files.blogimage.name;
      var path = process.cwd() + "/public/uploads/" + fileName;
      req.files.blogimage.mv(path);
   }

   var uname = req.body.username;
   var title = req.body.inputBlogTitle;
   var content = req.body.editorbox;
   var comments = req.body.CommentPermi;

   console.log(req.body);

   dbCon.query("insert into blogs(username,blogname,blogcontent,image,postdate,commentpermi) values(?,?,?,?,current_date(),?)", [uname, title, content, fileName, comments], function (err) {

      if(err==null)
      {
         resp.send("blog posted");
      }
      else{
         resp.send(err.toString());
      }
   })
})

//-------------------------- GET-PUBLISHER-NAME ==========================

app.get("/get-publisher", function (req, resp) {

   var username = req.query.uname;

   dbCon.query("select * from users where username=?", [username], function (err, resultTableJSON) {
      if (err == null)
         resp.send(resultTableJSON);
      else
         resp.send(err);
   })
})