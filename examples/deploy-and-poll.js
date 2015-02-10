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
    pollInterval: 5000
  }
});

org.authenticate().then(function(){
  var archive = archiver('zip');

  var promise = org.meta.deployAndPoll({ zipFile: archive });

  archive.directory('examples/src', 'src').finalize();

  return promise;
}).then(function(res) {
  console.dir(res.status);
}).error(function(err) {
  console.error(err);
});
