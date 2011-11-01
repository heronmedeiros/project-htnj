var Presentation = require("../models/presentation").model;

function indexAction(req, res) {
  Presentation.find(function(err, docs){
    res.render("presentations/index.ejs", {docs: docs});
  });
}

function newAction(req, res) {
  var doc = new Presentation();
  res.render("presentations/new.ejs", {doc: doc});
}

function createAction(req, res, next) {
  var errorHandler = function(error) {
    if (error) {
      next(error);
    }
  }

  req.form.complete(function(err, fields, files){
    errorHandler(err);

    var doc = new Presentation({title: fields.title});

    doc.save(function(err){
      errorHandler(err);

      doc.exportSlides(files.slides.path, __dirname + "/public/slides/", function(err){
        errorHandler(err);
        res.redirect("/presentations/" + doc.id + "/edit");
      });
    });
  });
}

function editAction(req, res) {
  Presentation.findById(req.params.id, function(err, presentation){
    if (err || !presentation) {
      return next(err || new Error("Missing presentation: " + req.params.id));
    }

    res.render("presentations/edit.ejs", {presentation: presentation});
  });
}

var setRoutes = function(app) {
  app.get("/presentations", indexAction);
  app.get("/presentations/new", newAction);
  app.post("/presentations", createAction);
  app.get("/presentations/:id/edit", editAction);
}

module.exports = {
  init: function(app) {
    setRoutes(app);
  }
};
