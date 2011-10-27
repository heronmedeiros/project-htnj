var testCase = require("nodeunit").testCase
  , Attendee = require("../lib/models/attendee").model
  , attendee
  , anotherAttendee
;

module.exports["password default"] = testCase({
    "it generates password": function(test) {
      attendee = new Attendee();
      test.ok(attendee.password.match(/^[a-f0-9]{32}$/i));
      test.done();
    }

  , "it generates different passwords": function(test) {
      attendee = new Attendee();
      anotherAttendee = new Attendee();
      test.ok(attendee.password !== anotherAttendee.password);
      test.done();
  }
});


module.exports["gravatar url"] = testCase({
    "it returns url": function(test) {
      attendee = new Attendee({email: "john@doe.com"});
      test.equal(attendee.gravatarUrl, "http://www.gravatar.com/avatar/6a6c19fea4a3676970167ce51f39e6ee?s=25&d=mm")
      test.done();
    }
});