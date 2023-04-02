"use strict";

module.exports = {
  "loopback-component-explorer": {
    "mountPath": "/explorer",
    "generateOperationScopedModels": true
  },
  "@indophi/loopback-component-rabbitmq": {
    "topology": {
      "connection": {
        "uri": process.env.RABBITMQ_URI,
        "user": process.env.RABBITMQ_USER,
        "pass": process.env.RABBITMQ_PASSWORD,
        "timeout": 30000
      }
    }
  }
}
