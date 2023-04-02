'use strict'

var app = require('../server');

module.exports = function() {

  return async function handleError(error, req, res, next) {
    const ErrorLog = app.models.errorLog;

    if (error.status == ErrorLog.COINSENDA_CUSTOM_STATUS_CODE){
      next(error);
    } else {
      let custom_err = ErrorLog.CUSTOMERRORHANDLER_UNEXPECTED_ERROR(error);
      custom_err.message = error.message;
      next(custom_err);
    }

  }

};
