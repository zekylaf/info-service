'use strict';

const httpError = require('http-errors');
const _ = require('lodash');
const Sentry = require('@sentry/node');

module.exports = function(ErrorLog) {

  const CUSTOM_NAME = "Coinsenda Custom Error";
  ErrorLog.COINSENDA_CUSTOM_STATUS_CODE = 465;

  ErrorLog.COUNTRY_CREATE = defaultErrorLog;
  ErrorLog.COUNTRY_FIND = defaultErrorLog;
  ErrorLog.COUNTRY_FIND_ONE = defaultErrorLog;

  ErrorLog.CRYPTOCOMPARE_CREATE = defaultErrorLog;
  ErrorLog.CRYPTOCOMPARE_FIND = defaultErrorLog;
  ErrorLog.CRYPTOCOMPARE_FIND_ONE = defaultErrorLog;
  ErrorLog.CRYPTOCOMPARE_UPDATE = defaultErrorLog;


  ErrorLog.COUNTRY_GET_COUNTRY =  function(data = {}){
    let opts = {
      code: "country_0"
    };

    let error_message = "Cannot find country";

    let err = httpError(ErrorLog.COINSENDA_CUSTOM_STATUS_CODE, error_message, opts);

    let error_data = logErrorData(data);
    sendToSentry(err, error_data);

    return err;
  }

  ErrorLog.COUNTRY_CREATE_COUNTRY =  function(data = {}){
    let opts = {
      code: "country_1"
    };

    let error_message = "Cannot create country";

    let err = httpError(ErrorLog.COINSENDA_CUSTOM_STATUS_CODE, error_message, opts);
    err.name = CUSTOM_NAME;

    let error_data = logErrorData(data);
    sendToSentry(err, error_data);

    return err;
  }































  ErrorLog.CRYPTOCOMPARE_GET_CRYPTO_COMPARE =  function(data = {}){
    let opts = {
      code: "cryptocompare_0"
    };

    let error_message = "Cannot find crypto_compare";

    let err = httpError(ErrorLog.COINSENDA_CUSTOM_STATUS_CODE, error_message, opts);

    let error_data = logErrorData(data);
    sendToSentry(err, error_data);

    return err;
  }

  ErrorLog.CRYPTOCOMPARE_CREATE_CRYPTO_COMPARE =  function(data = {}){
    let opts = {
      code: "cryptocompare_1"
    };

    let error_message = "Cannot create crypto_compare";

    let err = httpError(ErrorLog.COINSENDA_CUSTOM_STATUS_CODE, error_message, opts);

    let error_data = logErrorData(data);
    sendToSentry(err, error_data);

    return err;
  }

  ErrorLog.CRYPTOCOMPARE_GET_DAILY_HISTORICAL_DATA_VALIDATE =  function(data = {}){
    let opts = {
      code: "cryptocompare_2"
    };

    let error_message = "Not passing input validation";

    let err = httpError(ErrorLog.COINSENDA_CUSTOM_STATUS_CODE, error_message, opts);
    err.name = CUSTOM_NAME;

    let error_data = logErrorData(data);
    sendToSentry(err, error_data);

    return err;
  }































  ErrorLog.BOOT_SYNC_COUNTRIES =  function(data = {}){
    let opts = {
      code: "boot_0"
    };

    let error_message = "Error syncing countries";

    let err = httpError(ErrorLog.COINSENDA_CUSTOM_STATUS_CODE, error_message, opts);
    err.name = CUSTOM_NAME;

    let error_data = logErrorData(data);
    sendToSentry(err, error_data);

    return err;
  }

































  ErrorLog.CUSTOMERRORHANDLER_UNEXPECTED_ERROR =  function(data = {}){
    let opts = {
      code: "customerrorhandler_0"
    };

    let error_message = "Error: unexpected error has been ocurred. See logs for more information.";

    let err = httpError(ErrorLog.COINSENDA_CUSTOM_STATUS_CODE, error_message, opts);
    err.name = CUSTOM_NAME;

    let error_data = logErrorData(data);
    sendToSentry(err, error_data);

    return err;
  }














  function logErrorData(data){
    console.log(data);
    let custom_data = formatCustomData(data);
    return custom_data;
  }

  function formatCustomData(data){
    let custom_data;
    if (!_.isEmpty(data) || (data instanceof Error)){
      if (typeof(data) != "object" || Array.isArray(data)){
        custom_data = data;
      } else {
        if (data instanceof Error){
          custom_data = JSON.stringify(data, Object.getOwnPropertyNames(data));
        } else {
          Object.keys(data).forEach((prop) => {
            if (data[prop] instanceof Error){
              data[prop] = JSON.stringify(data[prop], Object.getOwnPropertyNames(data[prop]));
            }
          });

          custom_data = data;
        }
      }
    }

    return custom_data;
  }


  function defaultErrorLog(err, data = {}){
    let error_data = logErrorData(data);
    sendToSentry(err, error_data);

    err.statusCode = ErrorLog.COINSENDA_CUSTOM_STATUS_CODE;
    return err;
  }

  function sendToSentry(err, error_data){
    Sentry.configureScope((scope) => {
      scope.setExtra("extra_data", error_data);
    });

    Sentry.captureException(err);
  }

};
