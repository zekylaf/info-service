'use strict'

var app = require('../server.js');
const CryptoCompare = require('./cryptocompare-client');
const CryptoCompareConfig = app.get('crypto_compare');


function InfoClientInterface(){

  this.cryptoCompare = new CryptoCompare(CryptoCompareConfig);

  InfoClientInterface.prototype.getDailyHistoricalData = async (data = {}) => {
    try{
      let res = await this.cryptoCompare.getDailyHistoricalData(data);
      return res;
    } catch(err){
      throw new Error(err);
    }
  }

}


module.exports = InfoClientInterface;
