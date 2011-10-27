var runner = require("nodeunit").reporters.default
  , mongoose = require("mongoose")
;

mongoose.connect("mongodb://localhost/howto_test");

runner.run(["./test"]);
