'use strict';

const moment = require("moment");

module.exports = function(CryptoCompare) {

  function createCryptoCompare(data){
    const ErrorLog = CryptoCompare.app.models.errorLog;
    return new Promise((resolve, reject) => {
      CryptoCompare.create(data, (err, crypto_compare_instance) => {
        if (err) return reject(ErrorLog.CRYPTOCOMPARE_CREATE(err, data));
        if (!crypto_compare_instance) return reject(ErrorLog.CRYPTOCOMPARE_CREATE_CRYPTO_COMPARE(data));
        return resolve(crypto_compare_instance);
      })
    });
  }


  /**
  * @name getDailyHistoricalData
  * @description looks for previous saved data or creates it. If it exists, then update it.
  * @param {object} data
  * @param {string} data.currency_from
  * @param {string} data.currency_to
  * @param {string} data.amount_days
  * @return crypto_compare_instance
  */
  CryptoCompare.getDailyHistoricalData = async function(data){
    const ErrorLog = CryptoCompare.app.models.errorLog;

    if (!validateGetDailyHistoricalData(data)) throw ErrorLog.CRYPTOCOMPARE_GET_DAILY_HISTORICAL_DATA_VALIDATE(data);

    let args = {
      pair: data.currency_from + "/" + data.currency_to
    };

    let crypto_compare_instance = await CryptoCompare.getExistantCryptoCompare(args);

    let historical_data;
    let ici = new CryptoCompare.app.libs.InfoClientInterface();

    if (!crypto_compare_instance){
      historical_data = await ici.cryptoCompare.getDailyHistoricalData(data);

      let crypto_compare_data = {
        pair: data.currency_from + "/" + data.currency_to,
        historical_data: historical_data
      };

      crypto_compare_instance = await createCryptoCompare(crypto_compare_data);
    }

    if (moment().unix() - moment(crypto_compare_instance.updated_at).unix() > 60){
      historical_data = await ici.cryptoCompare.getDailyHistoricalData(data);
      let to_update = {
        id: crypto_compare_instance.id
      };

      let new_data = {
        historical_data: historical_data
      };

      CryptoCompare.cryptoCompareUpdate(to_update, new_data);
    }


    return crypto_compare_instance;
  }

  function validateGetDailyHistoricalData(data){
    if (!data.currency_from) return false;
    if (!data.currency_to) return false;
    if (!data.amount_days) return false;
    return true;
  }

  CryptoCompare.cryptoCompareUpdate = function(to_update, new_data){
    const ErrorLog = CryptoCompare.app.models.errorLog;
    return new Promise((resolve, reject) => {
      CryptoCompare.updateAll(to_update, new_data, (err, info) => {
        if (err) return reject(ErrorLog.CRYPTOCOMPARE_UPDATE(err, {to_update: to_update, new_data: new_data}));
        return resolve(info.count);
      });
    });
  }

  CryptoCompare.getExistantCryptoCompare = function(params){
    const ErrorLog = CryptoCompare.app.models.errorLog;
    return new Promise((resolve, reject) => {
      CryptoCompare.findOne({where: params}, async (err, crypto_compare_instance) => {
        if (err) return reject(await ErrorLog.CRYPTOCOMPARE_FIND_ONE(err, params));
        if (!crypto_compare_instance) return resolve(false);
        return resolve(crypto_compare_instance);
      });
    });
  }

  CryptoCompare.getCryptoCompare = function(params){
    const ErrorLog = CryptoCompare.app.models.errorLog;
    return new Promise((resolve, reject) => {
      CryptoCompare.findOne({where: params}, async (err, crypto_compare_instance) => {
        if (err) return reject(await ErrorLog.CRYPTOCOMPARE_FIND_ONE(err, params));
        if (!crypto_compare_instance) return reject(await ErrorLog.CRYPTOCOMPARE_GET_CRYPTO_COMPARE(params));
        return resolve(crypto_compare_instance);
      });
    });
  }

  CryptoCompare.getAllCryptoCompares = function(params = {}){
    const ErrorLog = CryptoCompare.app.models.errorLog;
    return new Promise((resolve, reject) => {
      CryptoCompare.find({where: params}, async (err, crypto_compare_instances) => {
        if (err) return reject(await ErrorLog.CRYPTOCOMPARE_FIND(err, params));
        return resolve(crypto_compare_instances);
      });
    });
  }

};
