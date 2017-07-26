var express     = require("express");
var bodyParser  = require("body-parser");
var path        = require("path");

var app = express();
var userRouter = express.Router();

app.use(bodyParser.json({extended:"true"}));

app.use(express.static(path.join(__dirname,"public_www")));

var userList = [{user:"admin", password:"admin", admin:1}];
var bookList = [{
			author:"Kiayada Delacruz",
			title:"Duis a",
			id:100,
      loaned: ""
		},
		{
			author:"Audrey V. Lester",
			title:"Aliquam nec enim. Nunc",
			id:101,
      loaned: ""
		},
		{
			author:"Quincy S. Rojas",
			title:"lorem ut aliquam iaculis,",
			id:102,
      loaned: ""
		},
		{
			author:"Zoe O. Young",
			title:"aptent taciti sociosqu",
			id:103,
      loaned: ""
		},
		{
			author:"Ivor Cook",
			title:"Curabitur",
			id:104,
      loaned: ""
		},
		{
			author:"Chaney X. Lott",
			title:"orci tincidunt",
			id:105,
      loaned: ""
		}
];

app.post("/login", function(req, res){
  var found = false;
  for(var i = 0; i < userList.length; i++){
    if(req.body.userName == userList[i].user){
      found = true;
    }
    if(found){
      if(req.body.pword == userList[i].password){
        if(userList[i].admin == 1){
          res.json({token:"admin", user:userList[i].user});
          return;
        }else {
          res.json({token:"user", user:userList[i].user});
          return;
        }
      }
    }
  }
  res.send("No luck");
});

app.post("/newUser", function(req,res){
  var userName = req.body.userName;
  var pword = req.body.pword;

  for(var i = 0; i < userList.length; i++ ){
    if(req.body.userName == userList[i].user){
      res.send("Failure. User already exists.");
      return;
    }
  }

  var user = {user:userName,
              password:pword,
              admin:0 };


  userList.push(user);
  console.log(userList);
  res.send("Success");
});


// User router starts here
userRouter.use(function(req, res, next){
  var token = req.headers.token;
  if(token == "user" || token == "admin"){
    console.log("Authorized access");
    console.log(req.headers);
    next();
  } else {
    res.send("No cigar. Unauthorized access. Wrong token.")
  }
});

userRouter.post("/book", function(req, res){
  // book: id, author, title, loaned
  for(var i = 0; i < bookList.length; i++){
    if(req.body.id == bookList[i].id){
      if(bookList[i].loaned != ""){
        if(req.body.user == bookList[i].loaned){
          bookList[i].loaned = "";
          res.send({"id":bookList[i].id,"loaned":""});
          console.log("Book" + bookList[i].id + "returned");
          return;
        }
      } else {
        console.log(req.body.user + " loaning book");
        bookList[i].loaned = req.body.user;
        res.send({"id":bookList[i].id,"loaned":bookList[i].loaned});
        console.log("Book " + bookList[i].id + " loaned");
        return;
      }
    }
  }
	res.send({"id":"No such book"});
});

userRouter.get("/book", function(req, res) {
  console.log(bookList);
  res.send(bookList);
});

app.use("/api", userRouter);

app.listen(3000, function(){
  console.log("Listening port 3000...")
});
