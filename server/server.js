'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');
const Sentry = require('@sentry/node');

var app = module.exports = loopback();

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  setupSentry();

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});


function setupSentry(){
  const sentry_dsn = app.get('sentry_config').dsn;

  Sentry.init({
    dsn: sentry_dsn,
    tracesSampleRate: 1.0,
    environment: process.env.NODE_ENV
  });
  // The request handler must be the first middleware on the app
  app.use('initial:before', Sentry.Handlers.requestHandler());
  // The error handler must be before any other error middleware
  app.use('final:before', Sentry.Handlers.errorHandler());
}
