'use strict';
const Sentry = require('@sentry/node');

module.exports = function() {
  return async function(req, res, next) {

    if (!req.user || !req.user.id) return next();

    let user_info = {
      email: req.user.email,
      id: req.user.id
    };

    Sentry.configureScope((scope) => {
      scope.setUser(user_info);
    });

    return next();
  };
};
