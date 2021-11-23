var Config = {};

function init() {
  Config = require('../data/config.json');
}
init();

exports.config = Config;
