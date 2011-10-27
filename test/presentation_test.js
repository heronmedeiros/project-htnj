var testCase = require("nodeunit").testCase
  , Presentation = require("../lib/models/presentation").model
  , Attendee = require("../lib/models/attendee").schema
  , presentation
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
