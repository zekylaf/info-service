'use strict';

const InfoClientInterface = require('../libs/info-client-interface.js');

module.exports = function(app) {

  app.libs = {};
  app.libs.InfoClientInterface = InfoClientInterface;

}
