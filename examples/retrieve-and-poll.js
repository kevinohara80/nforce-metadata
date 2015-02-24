var nforce   = require('nforce');
var _        = require('lodash');
var util     = require('util');
var archiver = require('archiver');

require('../')(nforce);

var org = nforce.createConnection({
  clientId: '3MVG9rFJvQRVOvk5nd6A4swCyck.4BFLnjFuASqNZmmxzpQSFWSTe6lWQxtF3L5soyVLfjV3yBKkjcePAsPzi',
  clientSecret: '9154137956044345875',
  redirectUri: 'http://localhost:3000/oauth/_callback',
  mode: 'single',
  username: process.env.SFUSER,
  password: process.env.SFPASS,
  plugins: ['meta'],
  metaOpts: {
    pollInterval: 1000
  }
});

org.authenticate().then(function(){
  var promise = org.meta.retrieveAndPoll({
    apiVersion: '30.0',
    unpackaged: {
      version: '30.0',
      types: [
        {
          name: 'CustomObject',
          members: ['*']
        }
      ]
    }
  });

  promise.poller.on('poll', function(res) {
    console.log('poll status: ' + res.status);
  });

  return promise;
}).then(function(res) {
  console.log('completed: ' + res.status);
  console.log(res.zipFile);
}).error(function(err) {
  console.error(err);
});
