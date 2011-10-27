var mongoose = require("mongoose")
  , crypto = require("crypto")
  , AttendeeSchema
  , Attendee
;

AttendeeSchema = new mongoose.Schema({
    email: {type: String, index: true}
  , createAt: {type: Date, default: Date.now}
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

Attendee = mongoose.model("Attendee", AttendeeSchema);

Attendee.authenticate = function(email, password) {
  return false
};

module.exports = {
    schema: AttendeeSchema
  , model: Attendee
};
