var nforce = require('nforce');
var _      = require('lodash');
var util   = require('util');

require('../')(nforce);

var org = nforce.createConnection({
  clientId: '3MVG9rFJvQRVOvk5nd6A4swCyck.4BFLnjFuASqNZmmxzpQSFWSTe6lWQxtF3L5soyVLfjV3yBKkjcePAsPzi',
  clientSecret: '9154137956044345875',
  redirectUri: 'http://localhost:3000/oauth/_callback',
  mode: 'single',
  username: process.env.SFUSER,
  password: process.env.SFPASS,
  plugins: ['meta'],
  autoRefresh: true,
  onRefresh: function(newOAuth, oldOAuth, cb) {
    console.log('got the refresh');
    cb();
  }
});

org.authenticate().then(function(){
  return org.revokeToken(org.getOAuth().access_token);
}).then(function(desc) {
  return org.meta.listMetadata({
    queries: [
      { type: 'CustomObject' },
      { type: 'ApexClass' },
      { type: 'ApexPage' }
    ]
  });
}).then(function(md) {
  console.log(md);
}).error(function(err) {
  console.error(err.message);
});
