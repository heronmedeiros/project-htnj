var express = require("express")
  , sys = require("sys")
  , form = require("connect-form")
  , app = express.createServer()
  , mongoose = require("mongoose")
  , Attendee = require("./lib/models/attendee").model
  , Presentation = require("./lib/models/presentation").model
  , Config = require("./config")[process.env.NODE_ENV || "development"]
;

mongoose.connect(Config.mongodb);

app.configure(function(){
  app.use(express.methodOverride());
  app.use(form({keepExtensions: true}));
  app.use(express.bodyParser());
  app.use(express.logger());
  app.use(express.static(__dirname + "/public"));
  app.set("view options", {layout: "layout.ejs"});
});

app.get("/", function(req, res){
  res.render("home.ejs");
});

app.post("/enter", function(req, res){
  Attendee.authenticate(
    req.body.email, req.body.password,
    function(err, doc) {
      if (doc) {
        // yay!
      } else {
        res.render("home.ejs", {error: "Invalid credentials"});
      }
  });
});

require("./lib/controllers/presentations").init(app);

app.get("/presentations/:presentation_id/attendees/new", function(req, res){
  var doc = new Attendee();
  res.render("attendees/new.ejs", {doc: doc});
});

// Start server
app.listen(2345);
console.log("Server started at localhost:2345");
