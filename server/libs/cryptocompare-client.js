'use strict';

const request = require('request-promise-native');

function CryptoCompare(params){

  this.config = params;
}

CryptoCompare.prototype.getDailyHistoricalData = async function(data = {}){

  let uri = this.config.url + "/data/histoday?";
  uri = uri + "fsym=" + data.currency_from;
  uri = uri + "&tsym=" + data.currency_to;
  uri = uri + "&limit=" + data.amount_days;
  uri = uri + "&api_key={"+this.config.api_key+"}";

  let body = await request.get(uri);
  body = JSON.parse(body);

  if(body.Response == 'Error') return false;
  if(!body.Data.length) return false;

  let historical_data = [];

  for (let day_data of body.Data){
    historical_data.push({
      close_price: day_data.close,
      date: day_data.time
    });
  }

  return historical_data;
}


module.exports = CryptoCompare;
