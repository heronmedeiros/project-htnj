var mongoose = require("mongoose")
  , PresentationSchema
  , AttendeeSchema = require("./attendee").schema
;

PresentationSchema = new mongoose.Schema({
  slides: {type: Number, default: 0},
  attendees: [AttendeeSchema],
  title: {type: String}
});

mongoose.model("Presentation", PresentationSchema);

module.exports = {
    schema: PresentationSchema
  , model: mongoose.model("Presentation")
};
