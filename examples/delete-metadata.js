var nforce = require('nforce');
var _      = require('lodash');

require('../')(nforce);

var org = nforce.createConnection({
  clientId: '3MVG9rFJvQRVOvk5nd6A4swCyck.4BFLnjFuASqNZmmxzpQSFWSTe6lWQxtF3L5soyVLfjV3yBKkjcePAsPzi',
  clientSecret: '9154137956044345875',
  redirectUri: 'http://localhost:3000/oauth/_callback',
  mode: 'single',
  username: process.env.SFUSER,
  password: process.env.SFPASS,
  plugins: ['meta']
});

org.authenticate().then(function(){
  return org.meta.deleteMetadata({
    metadataType: 'CustomField',
    fullNames: [ 'Test_Object__c.Foo_Bar__c' ]
  });
}).then(function(res) {
  console.log('done');
  console.log(res);
}).error(function(err) {
  console.log('error');
  console.error(err);
});
