var Config = {};

function init() {
  Config = require('./config.json');
}
init();

exports.config = Config;
