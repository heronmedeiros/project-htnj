var mongoose = require("mongoose")
  , PresentationSchema
  , AttendeeSchema = require("./attendee").schema
  , exec = require("child_process").exec
  , path = require("path")
;

PresentationSchema = new mongoose.Schema({
  slides: {type: Number, default: 0},
  attendees: [AttendeeSchema],
  title: {type: String}
});

PresentationSchema.methods.exportSlides = function(pdf, root, callback) {
  var self = this
    , dir = path.join(root, this.id)
    , command = [
          "rm -rf '" + dir + "'"
        , "mkdir -p '" + dir + "'"
        , "gs -q -dNOPAUSE -dBATCH -sDEVICE=pngalpha -sOutputFile='" + dir + "/slides%d.png' '" + pdf + "'"
        , "ls '" + dir + "/' | wc -l"
      ].join(" && ")
  ;

  // console.log("==> command: ", command);

  exec(command, function(err, stdout, stderr){
    self.slides = parseInt(stdout.replace(/[^\d]/g, ""), 10);
    console.log("==> self: ", self);
    self.save(callback);
  });
};

mongoose.model("Presentation", PresentationSchema);

module.exports = {
    schema: PresentationSchema
  , model: mongoose.model("Presentation")
};
