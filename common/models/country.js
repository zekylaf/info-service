'use strict';

module.exports = function(Country) {

  Country.getCountry = function(params){
    const ErrorLog = Country.app.models.errorLog;
    return new Promise((resolve, reject) => {
      Country.findOne({where: params}, (err, country_instance) => {
        if (err) return reject(ErrorLog.COUNTRY_FIND_ONE(err, params));
        if (!country_instance) return reject(ErrorLog.COUNTRY_GET_COUNTRY(params));
        return resolve(country_instance);
      });
    });
  }

  Country.getExistantCountry = function(params){
    const ErrorLog = Country.app.models.errorLog;
    return new Promise((resolve, reject) => {
      Country.findOne({where: params}, (err, country_instance) => {
        if (err) return reject(ErrorLog.COUNTRY_FIND_ONE(err, params));
        if (!country_instance) return resolve(false);
        return resolve(country_instance);
      });
    });
  }

  Country.getAllCountrys = function(params = {}){
    const ErrorLog = Country.app.models.errorLog;
    return new Promise((resolve, reject) => {
      Country.find({where: params}, (err, country_instances) => {
        if (err) return reject(ErrorLog.COUNTRY_FIND(err, params));
        return resolve(country_instances);
      });
    });
  }

  Country.syncCountry = async function(countries){
    let country_instances = [];

    for (let country of countries){
      country.code = country.name.toLowerCase();
      country.prefix = country.callingCodes;
      if (country.currencies && country.currencies[0].code){
        country.currency_symbol = country.currencies[0].code.toLowerCase();
      }

      let country_instance = await Country.create(country);

      country_instances.push(country_instance);
    }

    return country_instances;
  }

};
