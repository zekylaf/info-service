'use strict';

const MongoTransaction = require('../../server/libs/modelTransaction.js');

module.exports = function(Auto) {

  Auto.cambiarColor = async function(data){

    let to_update = {
      color: data.color_actual
    };

    let new_data = {
      color: data.color_nuevo
    };

    let info = await updateAuto(to_update, new_data);
  }

  function updateAuto(to_update, new_data, opts = {}){
    return new Promise((resolve, reject) => {
      Auto.updateAll(to_update, new_data, opts, (err, info) => {
        if (err) reject(err);
        return resolve(info);
      });
    });
  }

  Auto.testTx = async function(data){

    let first_tx = new MongoTransaction(Auto);
    let second_tx = new MongoTransaction(Auto);
    first_tx.start();
    second_tx.start();

    let to_update = {
      color: data.color_actual
    };

    let new_data = {
      color: data.color_nuevo
    };

    let info = await updateAuto(to_update, new_data, {session: first_tx.session});

    info = await updateAuto(to_update, new_data, {session: second_tx.session});


    await first_tx.commit();

    return 123;
  }

};
