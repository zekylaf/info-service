'use strict'

const app = require('../server/server.js');
var expect = require("chai").expect;
const to = require("await-to-js").to;
var sandbox = require("sinon").createSandbox();
var moment = require("moment");


before(function(done) {
  if (app.booting) {
    return app.once('booted', done);
  }
  done();
});


describe("Test Model: CryptoCompare", async function(){

  describe("CryptoCompare.getExistantCryptoCompare", async function(){
    const CryptoCompare = app.models.cryptoCompare;
    var findOne_stub;

    beforeEach(() => {
      findOne_stub = sandbox.stub(CryptoCompare, "findOne");
    });

    afterEach(() => {
      sandbox.restore();
    });


    it("Must handle existant crypto_compare", async function(){
      findOne_stub.callsArgWith(1, null, {pair: "FakeCryptoCompare"});
      let crypto_compare_instance = await CryptoCompare.getExistantCryptoCompare({pair: "FakeCryptoCompare"});
      expect(crypto_compare_instance.pair).to.be.equal("FakeCryptoCompare");
    });

    it("Must handle not existant crypto_compare", async function(){
      findOne_stub.callsArgWith(1, null, false);
      let crypto_compare_instance = await CryptoCompare.getExistantCryptoCompare({pair: "not existant crypto_compare"});
      expect(crypto_compare_instance).to.be.false;
    });

    it("Must handle db error", async function(){
      findOne_stub.callsArgWith(1, new Error("fake error"));
      let [err] = await to(CryptoCompare.getExistantCryptoCompare({pair: "FakeCryptoCompare"}));
      expect(err.statusCode).to.be.equal(465);
    });

  });


  describe("CryptoCompare.getCryptoCompare", async function(){
    const CryptoCompare = app.models.cryptoCompare;
    var findOne_stub;

    beforeEach(() => {
      findOne_stub = sandbox.stub(CryptoCompare, "findOne");
    });

    afterEach(() => {
      sandbox.restore();
    });


    it("Must handle existant crypto_compare", async function(){
      findOne_stub.callsArgWith(1, null, {pair: "FakeCryptoCompare"});
      let crypto_compare_instance = await CryptoCompare.getCryptoCompare({pair: "FakeCryptoCompare"});
      expect(crypto_compare_instance.pair).to.be.equal("FakeCryptoCompare");
    });

    it("Must handle not existant crypto_compare", async function(){
      findOne_stub.callsArgWith(1, null, false);
      let [err] = await to(CryptoCompare.getCryptoCompare({pair: "not existant crypto_compare"}));
      expect(err.code).to.be.equal('cryptocompare_0');
    });

    it("Must handle db error", async function(){
      findOne_stub.callsArgWith(1, new Error("fake error"));
      let [err] = await to(CryptoCompare.getCryptoCompare({pair: "FakeCryptoCompare"}));
      expect(err.statusCode).to.be.equal(465);
    });

  });


  describe("CryptoCompare.getAllCryptoCompares", async function(){
    const CryptoCompare = app.models.cryptoCompare;
    var find_stub;

    beforeEach(() => {
      find_stub = sandbox.stub(CryptoCompare, "find");
    });

    afterEach(() => {
      sandbox.restore();
    });


    it("Must handle existant countries", async function(){
      find_stub.callsArgWith(1, null, [{pair: "FakeCryptoCompare"}]);
      let crypto_compare_instances = await CryptoCompare.getAllCryptoCompares({pair: "FakeCryptoCompare"});
      expect(crypto_compare_instances[0].pair).to.be.equal("FakeCryptoCompare");
    });

    it("Must handle db error", async function(){
      find_stub.callsArgWith(1, new Error("fake error"));
      let [err] = await to(CryptoCompare.getAllCryptoCompares({pair: "FakeCryptoCompare"}));
      expect(err.statusCode).to.be.equal(465);
    });

  });


  describe("CryptoCompare.cryptoCompareUpdate", async function(){
    const CryptoCompare = app.models.cryptoCompare;
    var update_stub;

    beforeEach(() => {
      update_stub = sandbox.stub(CryptoCompare, "updateAll");
    });

    afterEach(() => {
      sandbox.restore();
    });


    it("Must handle successful update", async function(){
      update_stub.callsArgWith(2, null, {count: 1});
      let count = await CryptoCompare.cryptoCompareUpdate({pair: "FakeCryptoCompare"});
      expect(count).to.be.equal(1);
    });

    it("Must handle db error", async function(){
      update_stub.callsArgWith(2, new Error("fake error"));
      let [err] = await to(CryptoCompare.cryptoCompareUpdate({pair: "FakeCryptoCompare"}));
      expect(err.statusCode).to.be.equal(465);
    });

  });


  describe("CryptoCompare.getDailyHistoricalData", async function(){
    const CryptoCompare = app.models.cryptoCompare;
    const CryptoCompareClient = require("../server/libs/cryptocompare-client");

    var findOne_stub;
    var create_stub;
    var getHistoricalData_stub;

    beforeEach(() => {
      create_stub = sandbox.stub(CryptoCompare, "create");
      findOne_stub = sandbox.stub(CryptoCompare, "findOne");
      getHistoricalData_stub = sandbox.stub(CryptoCompareClient.prototype, "getDailyHistoricalData");
    });

    afterEach(() => {
      sandbox.restore();
    });

    it("Must handle an incomplete args case", async function(){
      let args = {
        currency_from: 'BTC',
        currency_to: 'USD'
      };
      var [err] = await to(CryptoCompare.getDailyHistoricalData(args));
      expect(err.code).to.be.equal('cryptocompare_2');
    });

    it("Must handle a not existant crypto_compare_instance case", async function(){
      var crypto_compare = new CryptoCompare({pair: "BTC/USD"});

      findOne_stub.callsArgWith(1, null, false);
      getHistoricalData_stub.returns([]);
      create_stub.callsArgWith(1, null, crypto_compare);

      let args = {
        currency_from: 'BTC',
        currency_to: 'USD',
        amount_days: 30
      };
      var crypto_compare_instance = await CryptoCompare.getDailyHistoricalData(args);
      expect(crypto_compare_instance.pair).to.be.equal("BTC/USD");
    });

    it("Must handle an existant crypto_compare_instance case with recent update", async function(){
      var crypto_compare = new CryptoCompare({pair: "BTC/USD"});
      crypto_compare.updated_at = crypto_compare.created_at;

      findOne_stub.callsArgWith(1, null, crypto_compare);

      let args = {
        currency_from: 'BTC',
        currency_to: 'USD',
        amount_days: 30
      };
      var crypto_compare_instance = await CryptoCompare.getDailyHistoricalData(args);
      expect(getHistoricalData_stub.callCount).to.be.equal(0);
    });

    it("Must handle an existant crypto_compare_instance case with old update", async function(){
      let clock = sandbox.useFakeTimers({now: 1483228800000});
      var crypto_compare = new CryptoCompare({pair: "BTC/USD"});
      crypto_compare.updated_at = crypto_compare.created_at;
      clock.restore();

      findOne_stub.callsArgWith(1, null, crypto_compare);

      let args = {
        currency_from: 'BTC',
        currency_to: 'USD',
        amount_days: 30
      };
      var crypto_compare_instance = await CryptoCompare.getDailyHistoricalData(args);
      expect(getHistoricalData_stub.callCount).to.be.equal(1);
    });

  });

});
