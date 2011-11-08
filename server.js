var express = require("express")
  , sys = require("sys")
  , form = require("connect-form")
  , app = express.createServer()
  , mongoose = require("mongoose")
  , Attendee = require("./lib/models/attendee").model
  , Presentation = require("./lib/models/presentation").model
  , Config = require("./config").init()
  , subscriptionMailer = require("./lib/mailers/subscription")
  , io = require("socket.io").listen(app)
  , listeners = require("./lib/listeners").init(io)
;

console.log("=> connecting to mongodb: ", Config.mongodb);
mongoose.connect(Config.mongodb);

app.configure(function(){
  app.use(express.methodOverride());
  app.use(form({keepExtensions: true}));
  app.use(express.bodyParser());
  app.use(express.logger());
  app.use(express.static(__dirname + "/public"));
  app.set("view options", {layout: "layouts/admin.ejs"});
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

app.get("/presentations/:presentation_id/attendees/new", function(req, res, next){
  var presentationId = req.params.presentation_id;

  Presentation.findById(presentationId, function(err, presentation){
    if (!presentation) {
      return next(new Error("Missing presentation: " + presentationId));
    }

    var doc = new Attendee();
    res.render("attendees/new.ejs", {
        doc: doc
      , presentation: presentation
    });
  });
});

app.post("/presentations/:presentation_id/attendees", function(req, res, next){
  var presentationId = req.params.presentation_id;

  Presentation.findById(presentationId, function(err, presentation){
    if (!presentation) {
      return next(new Error("Missing presentation: " + presentationId));
    }

    var doc = new Attendee({
        email: req.body.email
      , speaker: req.body.speaker === "1"
    });

    presentation.attendees.push(doc);

    presentation.save(function(err){
      subscriptionMailer.send({
        attendee: doc
      });

      res.redirect("/presentations/" + presentationId + "/edit");
    });
  });
});

app.get("/attend/:attendee_id", function(req, res, next){
  var attendeeId = req.params.attendee_id;

  Presentation.findOne({"attendees._id": attendeeId}, function(err, doc){
    if (!doc) {
      return next(new Error("Invalid subscription id: " + attendeeId));
    }

    var attendee = doc.attendees.id(attendeeId);
    res.render("presentations/attend.ejs", {
        layout: "layouts/presentation.ejs"
      , attendee: attendee
      , presentation: doc
    });
  });
});

// Start server
app.listen(2345);
console.log("Server started at localhost:2345");
