var testCase = require("nodeunit").testCase
  , Attendee = require("../lib/models/attendee").model
  , mongoose = require("mongoose")
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

module.exports["authentication"] = testCase({
    setUp: function(callback) {
      mongoose.connect("mongodb://localhost/howto_test");
      Attendee.remove(function(){
        var attendee = new Attendee({
            email: "john@doe.com"
          , password: "test"
        });

        attendee.save(callback);
      });
    }

  , tearDown: function(callback) {
      mongoose.disconnect();
      callback();
    }

  , "it returns null for invalid credentials": function(test) {
      test.expect(1);

      Attendee.authenticate("invalid@example.com", "test", function(err, attendee){
        test.equal(attendee, null);
        test.done();
      });
    }

  , "it returns attendee for valid credentials": function(test) {
      test.expect(1);

      Attendee.authenticate("john@doe.com", "test", function(err, attendee){
        test.equal(attendee.constructor, Attendee);
        test.done();
      });
    }
});
