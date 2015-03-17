var md = require('../lib/md');
var _      = require('lodash');

describe('md', function(){

  describe('mdTypes', function(){

    it('should contain a valid mdType map', function(){
      _.map(md.mdTypes, function(mdv, mdk) {
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

          if(_.isString(v) && !md.mdTypes[v]) {
            throw new Error(mdk + ':' + k + ' contains invalid mdType: ' + v);
          }

        });

      });
    });

  });

})
