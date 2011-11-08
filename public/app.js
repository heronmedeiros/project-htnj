var HOWTO = {
    currentSlide: 0
  , socket: io.connect("/")
};

HOWTO.emitSlideChange = function() {
  this.send("slideChange", {
    slide: this.currentSlide
  });
};

HOWTO.send = function(event, payload) {
  if (!payload) {
    payload = {};
  }

  payload.attendeeId = attendee.id;
  payload.presentationId = presentation.id;
  this.socket.emit(event, payload);
};

HOWTO.preloadImages = function() {
  for (var i = 1; i <= presentation.slides; i++) {
    (new Image()).src = "/slides/" + presentation.id + "/slides" + i + ".png";
  }
};

HOWTO.nextSlide = function() {
  if (this.currentSlide < presentation.slides) {
    this.currentSlide += 1;
    this.emitSlideChange();
  }
};

HOWTO.prevSlide = function() {
  if (this.currentSlide > 1) {
    this.currentSlide -= 1;
    this.emitSlideChange();
  }
};

HOWTO.loadSlide = function() {
  var path = "/slides/" + presentation.id + "/slides" + this.currentSlide + ".png";
  $("#slide").attr("src", path);
  $("#current").text(this.currentSlide);
};

HOWTO.initControls = function() {
  $("#next").click(function(){
    HOWTO.nextSlide();
  });

  $("#prev").click(function(){
    HOWTO.prevSlide();
  });
};

HOWTO.onSlideChange = function(payload) {
  HOWTO.currentSlide = payload.slide;
  HOWTO.loadSlide();
};

HOWTO.onMessage = function(payload) {
  var avatar = $("<img />").attr("src", payload.gravatar)
    , nick = $("<strong />").text(payload.nick)
    , message = $("<span />").text(payload.message)
  ;

  $("<p />")
    .append(avatar)
    .append(nick)
    .append(message)
    .appendTo("#messages")
  ;
};

HOWTO.addListeners = function() {
  this.socket.on("connect", function(){
    console.log("=> connected to socket.io");
  });
  this.socket.on("slideChange", HOWTO.onSlideChange);
  this.socket.on("message", HOWTO.onMessage);
  this.send("init");
};

HOWTO.initChat = function() {
  $("#message").keydown(function(e){
    if (e.keyCode != 13) {
      return true;
    }

    e.preventDefault();

    HOWTO.send("message", {
      message: this.value
    });

    this.value = "";
  });
};

$(function(){
  HOWTO.preloadImages();
  HOWTO.nextSlide();
  HOWTO.initControls();
  HOWTO.addListeners();
  HOWTO.initChat();
});
