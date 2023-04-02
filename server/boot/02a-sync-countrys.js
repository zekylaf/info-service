'use strict';

const to = require('await-to-js').to;
var countries = require('../files/countries.json');

module.exports = async function syncCountries(app) {
  const ErrorLog = app.models.errorLog;
  const Country = app.models.country;

  let [err] = await to(Country.syncCountry(countries));
  if (err) throw ErrorLog.BOOT_SYNC_COUNTRIES({err: err});
};
