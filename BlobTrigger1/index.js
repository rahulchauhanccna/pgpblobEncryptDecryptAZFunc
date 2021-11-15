module.exports = async function (context, decryptedBlob, encryptedBlob) {

  context.log("JavaScript blob trigger function processed blob \n Blob:", context.bindingData.blobTrigger, "\n Blob Size:", decryptedBlob.length, "Bytes");

  const openpgp = require('openpgp')

  openpgp.initWorker({ path: 'openpgp.worker.js' });
  openpgp.config.debug = true
  const util = require('util');
  const fs = require('fs');
  const readFileAsync = util.promisify(fs.readFile);

``
  const publicKeyArmored = await readFileAsync('./public.key', {
    encoding: 'utf8',
    flag: 'r'
  });

  const options = {
    message: openpgp.message.fromText(decryptedBlob.toString()),
    publicKeys: (await openpgp.key.readArmored(publicKeyArmored)).keys
  };


  context.bindings.encryptedBlob = (await openpgp.encrypt(options)).data

  context.done();


};

