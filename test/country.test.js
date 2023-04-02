'use strict'

const app = require('../server/server.js');
var expect = require("chai").expect;
const to = require("await-to-js").to;
var sandbox = require("sinon").createSandbox();


before(function(done) {
  if (app.booting) {
    return app.once('booted', done);
  }
  done();
});
 

describe("Test Model: Country", async function(){

  describe("Country.syncCountry", async function(){
    const Country = app.models.country;
    var create_stub;

    beforeEach(() => {
      create_stub = sandbox.stub(Country, "create");
    });

    afterEach(() => {
      sandbox.restore();
    });

    it("Must create countries in Datasource", async function(){
      let countries = [
        fake_country
      ];

      create_stub.callsFake((country_args) => {return new Country(country_args)});
      let country_instances = await Country.syncCountry(countries);

      expect(country_instances).to.be.instanceof(Array);
      expect(country_instances[0].name).to.be.equal("FakeCountry");
      expect(country_instances[0].code).to.be.equal("fakecountry");
      expect(country_instances[0].prefix).to.be.eql(["93"]);
      expect(country_instances[0].currency_symbol).to.be.equal("afn");
    });

  });


  describe("Country.getExistantCountry", async function(){
    const Country = app.models.country;
    var findOne_stub;

    beforeEach(() => {
      findOne_stub = sandbox.stub(Country, "findOne");
    });

    afterEach(() => {
      sandbox.restore();
    });


    it("Must handle existant country", async function(){
      findOne_stub.callsArgWith(1, null, {name: "FakeCountry"});
      let country_instance = await Country.getExistantCountry({name: "FakeCountry"});
      expect(country_instance.name).to.be.equal("FakeCountry");
    });

    it("Must handle not existant country", async function(){
      findOne_stub.callsArgWith(1, null, false);
      let country_instance = await Country.getExistantCountry({name: "not existant country"});
      expect(country_instance).to.be.false;
    });

    it("Must handle db error", async function(){
      findOne_stub.callsArgWith(1, new Error("fake error"));
      let [err] = await to(Country.getExistantCountry({name: "FakeCountry"}));
      expect(err.statusCode).to.be.equal(465);
    });

  });


  describe("Country.getCountry", async function(){
    const Country = app.models.country;
    var findOne_stub;

    beforeEach(() => {
      findOne_stub = sandbox.stub(Country, "findOne");
    });

    afterEach(() => {
      sandbox.restore();
    });


    it("Must handle existant country", async function(){
      findOne_stub.callsArgWith(1, null, {name: "FakeCountry"});
      let country_instance = await Country.getCountry({name: "FakeCountry"});
      expect(country_instance.name).to.be.equal("FakeCountry");
    });

    it("Must handle not existant country", async function(){
      findOne_stub.callsArgWith(1, null, false);
      let [err] = await to(Country.getCountry({name: "not existant country"}));
      expect(err.code).to.be.equal('country_0');
    });

    it("Must handle db error", async function(){
      findOne_stub.callsArgWith(1, new Error("fake error"));
      let [err] = await to(Country.getCountry({name: "FakeCountry"}));
      expect(err.statusCode).to.be.equal(465);
    });

  });


  describe("Country.getAllCountrys", async function(){
    const Country = app.models.country;
    var find_stub;

    beforeEach(() => {
      find_stub = sandbox.stub(Country, "find");
    });

    afterEach(() => {
      sandbox.restore();
    });


    it("Must handle existant countries", async function(){
      find_stub.callsArgWith(1, null, [{name: "FakeCountry"}]);
      let country_instances = await Country.getAllCountrys({name: "FakeCountry"});
      expect(country_instances[0].name).to.be.equal("FakeCountry");
    });

    it("Must handle db error", async function(){
      find_stub.callsArgWith(1, new Error("fake error"));
      let [err] = await to(Country.getAllCountrys({name: "FakeCountry"}));
      expect(err.statusCode).to.be.equal(465);
    });

  });

});


var fake_country = {"alpha2Code": "AF", "alpha3Code": "AFG", "altSpellings": ["AF", "Af\u0121\u0101nist\u0101n"], "area": 652230, "borders": ["IRN", "PAK", "TKM", "UZB", "TJK", "CHN"], "callingCodes": ["93"], "capital": "Kabul", "currencies": [{"code": "AFN", "name": "Afghan afghani", "symbol": "\u060b"}], "demonym": "Afghan", "flag": "/data/afg.svg", "gini": 27.8, "languages": [{"iso639_1": "ps", "iso639_2": "pus", "name": "Pashto", "nativeName": "\u067e\u069a\u062a\u0648"}, {"iso639_1": "uz", "iso639_2": "uzb", "name": "Uzbek", "nativeName": "O\u02bbzbek"}, {"iso639_1": "tk", "iso639_2": "tuk", "name": "Turkmen", "nativeName": "T\u00fcrkmen"}], "latlng": [33, 65], "name": "FakeCountry", "nativeName": "\u0627\u0641\u063a\u0627\u0646\u0633\u062a\u0627\u0646", "numericCode": "004", "population": 27657145, "region": "Asia", "regionalBlocs": [{"acronym": "SAARC", "name": "South Asian Association for Regional Cooperation"}], "subregion": "Southern Asia", "timezones": ["UTC+04:30"], "topLevelDomain": [".af"], "translations": {"br": "Afeganist\u00e3o", "de": "Afghanistan", "es": "Afganist\u00e1n", "fa": "\u0627\u0641\u063a\u0627\u0646\u0633\u062a\u0627\u0646", "fr": "Afghanistan", "hr": "Afganistan", "it": "Afghanistan", "ja": "\u30a2\u30d5\u30ac\u30cb\u30b9\u30bf\u30f3", "nl": "Afghanistan", "pt": "Afeganist\u00e3o"}, "cioc": "AFG"};
