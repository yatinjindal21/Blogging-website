var express = require("express");
var fileuploader = require("express-fileupload");
const moment = require('moment');
// const res = require("express/lib/response");
var mysql = require("mysql2");
const path = require('path');
const ejsMate = require('ejs-mate');
const bodyParser = require('body-parser');

const session = require('express-session');





const dbCon = require('./config/db');


var app = express();
exports.app = app;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);



app.listen(2004, function () {
   console.log("server started");
})

app.use(express.static("public"));
app.use(fileuploader());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded(true));



app.use(session({
   secret: 'mySession123', // Replace with a strong secret key
   resave: false,
   saveUninitialized: true,
}));





app.get("/", function (req, res) {
   // resp.sendFile(process.cwd() + "/public/index.html");
   // res.render('index');
})

app.get("/login", function (req, resp) {
   resp.sendFile(process.cwd() + "/public/login.html");
})

app.get("/signup", function (req, resp) {
   resp.sendFile(process.cwd() + "/public/signup.html");
})

app.get("/home", function (req, res) {
   // resp.sendFile(process.cwd() + "/public/home.html");
   res.render('home');
})





//---------------------------DB Operations-------------------
//================Database Connectivity============
// var dbConfig = {
//    host: "127.0.0.1",
//    user: "root",
//    password: "Penguin@2004",
//    database: "youandme",
//    dateStrings: true
// }

// var dbCon = mysql.createConnection(dbConfig);
// dbCon.connect(function (err) {
//    if (err == null)
//       console.log("Connected Successfulllyyy...");
//    else
//       console.log(err);
// })


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
         req.session.username = username;
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
               req.session.username = username;
               
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

//------------------------------------- GET-ACTIVE-USERNAME ===================================


// app.post('/set-active-id', (req, res) => {
//    const activeID = req.body.activeID;

//    if (activeID) {
//        req.session.activeID = activeID; // Store activeID in the session
//        res.send(`Received and stored activeID: ${activeID}`);
//    } else {
//        res.status(400).send('activeID is required');
//    }
// });


app.use((req, res, next) => {
   const user = req.session.username;
   if (user) {
      dbCon.query('SELECT * FROM notifications WHERE username = ?', [user], (err, notifs) => {
         if (err) {
            console.log(err);
            return next(); // Skip fetching notifications if there's an error
         }
         notifs.forEach(notif => {
            notif.relativeTime = moment(notif.created_at).fromNow();
        });
         // Make notifications available in all views
         res.locals.notifs = notifs;
         next();
      });
   } else {
      next(); // No user logged in, proceed without fetching notifications
   }
});

app.use((req, res, next) => {

   res.locals.currentUser = req.session.username || null; 
   next();
});

//------------------------------ POST-BLOG ==================================

app.get("/display-blogs", function (req, res) {
   // resp.sendFile(process.cwd() + "/public/display-blogs.html");
   res.render('blog/index');
})

app.get("/create-blog", function (req, res) {
   res.render('blog/create');
})


app.post("/post-blog", function (req, res) {

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

   dbCon.query("insert into blogs(username,blogname,blogcontent,image,postdate,commentpermi) values(?,?,?,?,current_date(),?)", [uname, title, content, fileName, comments], function (err, table) {

      if (err == null) {
         const id = table.insertId;
         res.redirect(`/view-blog/${id}`);
      }
      else {
         res.send(err.toString());
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


//-------------------------- SHOW ALL BLOGS =================================

// app.get("/show-all-blogs", function (req,res){
//    res.render('blog/index');
// })

//-------------------------- GET ALL BLOGS ===============================

app.get("/get-all-blogs", function (req, resp) {

   var username = req.query.username;

   dbCon.query(`SELECT b.username,b.blogid,b.blogname,b.blogcontent,b.image,b.postdate,b.commentpermi,b.likes,
      MAX(CASE WHEN l.username = ? THEN l.username ELSE NULL END) AS liker FROM blogs b LEFT OUTER JOIN 
      bloglikes l ON b.blogid = l.blogid GROUP BY b.blogid`, [username], function (err, resultTableJSON) {

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

   var tofind = req.query.item;
   var query1 = `(SELECT username, pic FROM users WHERE username LIKE ? UNION SELECT username, pic FROM users WHERE username LIKE ?) LIMIT 5`;
   var query2 = `(SELECT blogid, blogname, image FROM blogs WHERE blogname LIKE ? UNION SELECT blogid, blogname, image FROM blogs WHERE blogname LIKE ?) LIMIT 5`;

   dbCon.query(query1, [`${tofind}%`, `%${tofind}%`], function (err, usersTable) {
      if (err) {
         resp.send(JSON.stringify(err));
      }

      dbCon.query(query2, [`${tofind}%`, `%${tofind}%`], function (err, blogsTable) {
         if (err) {
            resp.send(JSON.stringify(err));
         }

         resp.json({
            users: usersTable,
            blogs: blogsTable
         });

      });
   });
});

//--------------------------------- OPEN SEARCHED ONE ======================================

app.get("/open-searched-one", function (req, resp) {
   var finder = req.query.finder;

   dbCon.query("select * from users where username=? or name=?", [finder, finder], function (err, resultTableJSON) {
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
      } t
   })
})

app.get("/view-blog/:id", (req, res) => {
   // resp.sendFile(process.cwd() + "/public/view-blog.html");
   const { id } = req.params;
   query = 'SELECT blogs.*, users.name FROM blogs JOIN users ON blogs.username=users.username WHERE blogs.blogid=?';
   dbCon.query(query, [id], (err, blog) => {
      if (err) { res.send(err); }
      query = 'SELECT * FROM comments WHERE blogid=?';
      dbCon.query(query, [id], (err, comments) => {
         if (err) { res.send(err); }
         console.log(blog);
         // console.log(blog[0].username)

            res.render('blog/view', { blog, comments});

         // console.log(blog)
         // console.log(comments);

      });

   });
   // res.render('view',{blog,comments});

});



app.post('/view-blog/:id/comment', (req, res) => {
   const body = req.body.comment;
   const username = req.query.username;
   const blogid = req.params.id;
   query = 'INSERT INTO comments VALUES(cid,?,?,?)';
   dbCon.query(query, [body, username, blogid], (err) => {
      if (err) {
         console.log(err);
      }
      dbCon.query('SELECT pic FROM users WHERE username=?', [username], (err, pic) => {
         if (err) {
            console.log(err);
         }
         console.log(pic);
         dbCon.query('SELECT username FROM blogs WHERE blogid=?', [blogid], (err, userblog) => {
            if (err) {
               console.log(err);
            }
            query = 'INSERT INTO notifications VALUES(nid,?,?,?,?,?,isRead,current_timestamp())';
            dbCon.query(query, [body, userblog[0].username, username,pic[0].pic, blogid,], (err) => {
               res.redirect(`/view-blog/${blogid}`);
            })
         })
      })
      // query='INSERT INTO notifications (body, username, author, blogid, isRead) VALUES (`${username} commented: ${body}`, `${username}`, `${author}`, `${blogid}`, false);'

   })
})

app.get('/profile/:uname',(req,res)=>{
   const user=req.params.uname;
   query='SELECT * FROM users WHERE username=?';
   dbCon.query(query,[user],(err,userTable)=>{
      if(err){
         
         res.send(err);
      }
      // console.log(userTable);
      console.log(userTable);
      dbCon.query('SELECT * FROM blogs WHERE username=?',[user],(err,blogTable)=>{
         if(err){
            res.send(err);
         }
         // console.log(blogTable);
         res.render('profile',{userTable,blogTable});
      })
      
   })
 
})

app.get('/:uname/settings',(req,res)=>{
   const user=req.params.uname;
   dbCon.query('SELECT * FROM users WHERE username=?',[user],(err,userTable)=>{
      if(err) res.send(err);
      console.log(userTable);
      res.render('settings',{userTable});
   })

})

app.post('/:uname/edit-profile',(req,res)=>{
   const user=req.params.uname;
   const {username,name}=req.body;
   if (req.files != null) {
      //console.log(process.cwd());
      pics = req.files.pic.name;
      var path = process.cwd() + "/public/uploads/" + pics;
      req.files.pic.mv(path);
   }

   console.log(username);
   console.log(name);
   const query='UPDATE users SET username=?,name=?,pic=? WHERE username=?';
   dbCon.query(query,[username,name,pics,user],(err)=>{
      if(err) console.log(err);
      res.redirect(`/profile/${user}`);
   })
})


app.post('/:uname/security',(req,res)=>{
   const user=req.params.uname;
   const {email,password}=req.body;
   const query='UPDATE users SET email=?,password=? WHERE username=?';
   dbCon.query(query,[email,password,user],(err)=>{
      if(err) console.log(err);
      res.redirect(`/${user}/settings`);
   })
})