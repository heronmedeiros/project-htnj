var io
  , presentations = {}
  , Presentation = require("./models/presentation").model
;

function findAttendee(payload, callback) {
  var attendeeId = payload.attendeeId
    , presentationId = payload.presentationId
    , query = {
          "_id": presentationId
        , "attendees._id": attendeeId
      }
  ;

  console.log("==> query: ", query);

  Presentation.findOne(query, function(err, presentation){
    console.log("==> args: ", arguments);

    if (err || !presentation) {
      return;
    }

    if (!presentations[presentationId]) {
      presentations[presentationId] = {};
    }

    var attendee = presentation.attendees.id(attendeeId);

    console.log("==> ", [presentation, attendee]);
    callback(presentation, attendee);
  });
}

function fromAttendee(payload, callback) {
  findAttendee(payload, function(presentation, attendee){
    callback(presentation, attendee);
  });
}

function fromSpeaker(payload, callback) {
  findAttendee(payload, function(presentation, attendee){
    if (attendee.speaker) {
      callback(presentation, attendee);
    }
  });
}

function onSlideChange(socket, payload) {
  fromSpeaker(payload, function(){
    presentations[payload.presentationId].currentSlide = payload.slide;
    io.sockets.emit("slideChange", {slide: presentations[payload.presentationId].currentSlide});
  });
}

function delegate(socket, callback) {
  return function(payload) {
    callback.call(null, socket, payload);
  }
}

function onInit(socket, payload) {
  var presentation = presentations[payload.presentationId];

  if (!presentation) {
    return;
  }

  socket.emit("slideChange", {slide: presentation.currentSlide});
}

function onMessage(socket, payload) {
  fromAttendee(payload, function(presentation, attendee){
    io.sockets.emit("message", {
        message: payload.message
      , nick: attendee.nick
      , gravatar: attendee.gravatarUrl
    });
  });
}

function init() {
  io.sockets.on("connection", function(socket){
    socket.on("slideChange", delegate(socket, onSlideChange));
    socket.on("init", delegate(socket, onInit));
    socket.on("message", delegate(socket, onMessage));
  });
}

module.exports = {
  init: function(connection) {
    io = connection;
    init();
  }
}
