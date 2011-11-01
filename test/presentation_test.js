var testCase = require("nodeunit").testCase
  , Presentation = require("../lib/models/presentation").model
  , Attendee = require("../lib/models/attendee").schema
  , presentation
  , mongoose = require("mongoose")
  , fs = require("fs")
;

module.exports["attendees collection"] = testCase({
    "it responds to attendees": function(test) {
      test.ok(Presentation.prototype.hasOwnProperty("attendees"));
      test.done();
    }

  , "it wraps attendee instance": function(test) {
      presentation = new Presentation();
      presentation.attendees.push({
          name: "John Doe"
        , email: "john@doe.com"
      });

      // test.ok(presentation.attendees[0].constructor === Attendee);
      test.done();
    }
});

module.exports["slides exporting"] = testCase({
    setUp: function(callback) {
      mongoose.connect("mongodb://localhost/howto_test");
      Presentation.remove(function(){
        presentation = new Presentation({title: "Sample"});
        presentation.save(function(){
          presentation.exportSlides(
              __dirname + "/sample.pdf"
            , "/tmp/slides"
            , callback
          );
        });
      });
    }

  , tearDown: function(callback) {
      mongoose.disconnect();
      callback();
    }

  , "it updates presentation slides": function(test) {
      test.equal(presentation.slides, 6);
      test.done();
    }

  , "it exports images": function(test) {
      test.equal(fs.readdirSync("/tmp/slides/" + presentation.id).length, 6);
      test.done();
    }

});
