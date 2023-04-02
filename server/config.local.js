'use strict';

module.exports = {
	"port": 3010,
	"sentry_config": {
    "dsn": process.env.COUNTRYLIST_SENTRYCONFIG_DSN
  },
  "testing": JSON.parse(process.env.TEST_FLAG)
};
