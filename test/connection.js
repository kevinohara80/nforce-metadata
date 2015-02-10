/*jshint -W030 */

var _      = require('lodash');
var nforce = require('nforce');
var should = require('should');

require('../')(nforce);

var conn = nforce.createConnection({
  clientId: '3MVG9rFJvQRVOvk5nd6A4swCyck.4BFLnjFuASqNZmmxzpQSFWSTe6lWQxtF3L5soyVLfjV3yBKkjcePAsPzi',
  clientSecret: '9154137956044345875',
  redirectUri: 'http://localhost:3000/oauth/_callback',
  mode: 'single',
  plugins: ['meta']
});

describe('connection', function(){

  describe('#init', function(){

    it('should have listMetadata function', function() {
      should.exist(conn.meta.listMetadata);
      conn.meta.listMetadata.should.be.a.function;
    });

  });

});
