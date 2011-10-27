var express = require("express")
  , sys = require("sys")
  , form = require("connect-form")
  , app = express.createServer(form({keepExtensions: true}))
;

app.configure(function(){
  app.use(express.methodOverride());
  app.use(express.bodyParser());
});

app.get("/", function(req, res){
  res.render("home.ejs", {layout: "layout.ejs"});
});

app.post("/enter", function(req, res){
  res.send(sys.inspect({
      body: req.body
    , params: req.params
  }));
});

// Start server
app.listen(2345);
console.log("Server started at localhost:2345");
