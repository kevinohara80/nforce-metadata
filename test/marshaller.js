var parser = require('../lib/parser');
var _      = require('lodash');

describe('marshaller', function(){

  describe('mdTypes', function(){

    it('should contain a valid mdType map', function(){
      _.map(parser.mdTypes, function(mdv, mdk) {
        if(_.isUndefined(mdv)) {
          throw new Error(mdk + ' is undefined');
        }

        if(!_.isObject(mdv)) {
          throw new Error(mdk + ' is not an object');
        }

        _.map(mdv, function(v, k) {

          // console.log(mdk + ':' + k + ':' + v);

          if(_.isArray(v)) {
            v = v[0];
          }

          if(_.isUndefined(v)) {
            throw new Error(mdk + ':' + k + ' is undefined');
          }

          if(_.isString(v) && !parser.mdTypes[v]) {
            throw new Error(mdk + ':' + k + ' contains invalid mdType: ' + v);
          }

        });

      });
    });

  });

})
