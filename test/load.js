var _      = require('lodash');
var nforce = require('nforce');
var meta   = require('../');

describe('load', function(){

  describe('#function', function(){

    it('should not throw in init', function() {
      meta(nforce, { namespace: 'meta', override: true });
    });

    it('should allow alternative namespaces', function() {
      meta(nforce, { namespace: 'foobar', override: true });
    });

  });

});
