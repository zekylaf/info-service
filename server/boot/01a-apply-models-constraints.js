'use strict'


module.exports = async function(app) {
  let datasource_name = 'info-service-db';

  let models = [
    app.models.cryptoCompare
  ];

  for (let model of models){
    await autoUpdate(model.name, datasource_name);
  }



  function autoUpdate(model_name, datasource_name){
    var ds = app.dataSources[datasource_name];

    return new Promise((resolve, reject) => {
      ds.autoupdate(model_name, function(err, result) {
        if (err) return reject(err);
        return resolve(result);
      });
    });
  }
}
