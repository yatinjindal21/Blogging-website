var express = require("express");
var fileuploader = require("express-fileupload");
const res = require("express/lib/response");
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

app.get("/view-blog", function (req, resp) {
   resp.sendFile(process.cwd() + "/public/view-blog.html");
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
         console.log("done");
         resp.send("done");
      }
      else {
         resp.send(err.toString());
      }
   })
})

//---------------------------------------------- LOGIN ====================================================

app.get("/login-user", function (req, resp) {
   var username = req.query.kuchUname;
   var password = req.query.kuchPwd;

   dbCon.query("select * from users where username=?", [username], function (err, resultTable) {
      if (err == null) {

         if (resultTable.length == 1) {

            if (resultTable[0].password == password) {
               resp.send(resultTable[0].type);
            }
            else
               resp.send("(Incorrect Password)");
         }
         else
            resp.send("(Invalid Username)");
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

      if (err == null) {
         resp.send("blog posted");
      }
      else {
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

//-------------------------- GET ALL BLOGS ===============================

app.get("/get-all-blogs", function (req, resp) {

   var username = req.query.username;

   dbCon.query("SELECT b.username,b.blogid,b.blogname,b.blogcontent,b.image,b.postdate,b.commentpermi,b.likes,MAX(CASE WHEN l.username = ? THEN l.username ELSE NULL END) AS liker FROM blogs b LEFT OUTER JOIN bloglikes l ON b.blogid = l.blogid GROUP BY b.blogid", [username], function (err, resultTableJSON) {

      if (err == null)
         resp.send(resultTableJSON);
      else
         resp.send(err);
   })
})

//--------------------------- GET BLOG DATA =================================

app.get("/get-blog-data", function (req, resp) {

   var blogid = req.query.blogid;

   dbCon.query("select * from blogs where blogid=?", [blogid], function (err, resultTableJSON) {
      if (err == null)
         resp.send(resultTableJSON);
      else
         resp.send(err);
   })
})

//---------------------------- DO LIKE =====================================

app.get("/do-blog-like", function (req, resp) {

   var blogid = req.query.blogid;
   var username = req.query.username;
   // console.log(req.query);

   dbCon.query("select * from bloglikes where username=? and blogid=?", [username, blogid], function (err, resultTable) {
      if (err == null) {
         if (resultTable.length == 1) {
            dbCon.query("delete from bloglikes where username=? and blogid=?", [username, blogid], function (err) {
               if (err == null) {
                  dbCon.query("update blogs set likes=(select count(*) from bloglikes where blogid=?) where blogid=?", [blogid, blogid], function (err) {
                     if (err == null) {
                        resp.send("not liked");
                     }
                     else {
                        resp.send(err);
                     }
                  })
               }
               else {
                  resp.send(err);
               }
            })
         }
         else {
            dbCon.query("insert into bloglikes values(?,?)", [username, blogid], function (err, resultTable) {
               if (err == null) {
                  dbCon.query("update blogs set likes=(select count(*) from bloglikes where blogid=?) where blogid=?", [blogid, blogid], function (err) {
                     if (err == null) {
                        resp.send("liked");
                     }
                     else {
                        resp.send(err);
                     }
                  })
               }
               else {
                  resp.send(err);
               }
            })
         }
      }
      else
         resp.send(err);
   })
})

//----------------------------- SEARCH RECORDS ===========================================

app.get("/get-searched-records", function (req, resp) {
   var tofind = req.query.tofind;
   var queryString = `SELECT distinct username FROM users WHERE username LIKE ? UNION SELECT distinct name FROM users WHERE name LIKE ? UNION SELECT blogname FROM blogs WHERE blogname LIKE ? LIMIT 10`;

   if (tofind == '') {
      resp.send('no data');
   }
   else {
      dbCon.query(queryString, [`${tofind}%`, `${tofind}%`, `${tofind}%`], function (err, resultTableJSON) {
         if (err == null) {
            resp.send(resultTableJSON);
         } else {
            resp.send(JSON.stringify(err));
         }
      })
   }
})

//--------------------------------- OPEN SEARCHED ONE ======================================

app.get("/open-searched-one", function (req, resp) {
   var finder = req.query.finder;

   dbCon.query("select * from users where username=? or name=?", [finder,finder], function (err, resultTableJSON) {
      console.log(resultTableJSON);
      if (err == null) {
         if (resultTableJSON.length > 0) {
            resp.send(resultTableJSON);
         }
         else {
            dbCon.query("select * from blogs where blogname=?", [finder], function (err, resultTableJSON) {
               console.log(resultTableJSON);
               if (err == null) {
                  resp.send(resultTableJSON);
               }
               else {
                  resp.send(err);
               }
            })
         }
      }
      else {
         resp.send(err);
      }
   })
})