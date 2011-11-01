var runner = require("nodeunit").reporters.default
  , mongoose = require("mongoose")
;

runner.run(["./test"]);
