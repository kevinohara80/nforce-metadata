var nforce   = require('nforce');
var _        = require('lodash');
var util     = require('util');
var archiver = require('archiver');
var Promise  = require('bluebird');

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
  var archive = archiver('zip');
  var promise = org.meta.deploy({ zipFile: archive });

  archive.directory('examples/src', 'src').finalize();

  return promise;
}).then(function(res) {
  return new Promise(function(resolve, reject) {
    var poller = org.meta.pollDeployStatus({ id: res.id, includeDetails: true });

    poller.on('poll', function(res) {
      console.log('poll: ' + res.status);
    });

    poller.on('done', resolve);
    poller.on('error', reject);
  });
}).then(function(res){
  console.log('done: ' + res.status);
}).error(function(err) {
  console.error(err);
});
