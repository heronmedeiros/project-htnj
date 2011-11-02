var nodemailer = require("nodemailer")
  , Config = require("../../config").init()
  , ejs = require("ejs")
  , fs = require("fs")
;

nodemailer.SMTP = Config.smtp;

module.exports["build"] = function(options) {
  return {
      sender: Config.from
    , to: options.attendee.email
    , subject: "Subscription confirmation"
    , body: "foo"
    , html: ejs.render(fs.readFileSync(__dirname + "/../../views/mailers/subscription.ejs"), {
        locals: {
            config: Config
          , attendee: options.attendee
        }
    })
  };
};

module.exports["send"] = function(options) {
  var mail = this.build(options);
  nodemailer.send_mail(mail);
};
