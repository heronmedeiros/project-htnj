var mongoose = require("mongoose")
  , crypto = require("crypto")
  , AttendeeSchema
  , Attendee
;

AttendeeSchema = new mongoose.Schema({
    email: {type: String, index: true}
  , createAt: {type: Date, default: Date.now}
  , speaker: {type: Boolean, default: false}
  , password: {type: String, default: function(){
      var seed = (Date.now() + Math.random()).toString();
      return crypto.createHash("md5").update(seed).digest("hex");
  }}
});

AttendeeSchema.virtual("gravatarUrl")
  .get(function(){
    var hash = crypto.createHash("md5").update(this.email.toString()).digest("hex");
    return "http://www.gravatar.com/avatar/" + hash + "?s=25&d=mm";
  })
;

AttendeeSchema.virtual("role")
  .get(function(){
    return this.speaker ? "speaker" : "attendee";
  })
;

// Attendee.authenticate(email, password, function(err, user){});
//
AttendeeSchema.statics.authenticate = function(email, password, callback) {
  Attendee.findOne({email: email, password: password}, function(err, doc){
    if (err) {
      return callback(err);
    }

    callback(null, doc);
  });
};

Attendee = mongoose.model("Attendee", AttendeeSchema);

module.exports = {
    schema: AttendeeSchema
  , model: Attendee
};
