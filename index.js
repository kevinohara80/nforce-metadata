var _ = require('lodash');

module.exports = function(nforce, name) {
  // throws if the plugin already exists
  var plugin = nforce.plugin(name || 'meta');

  plugin.fn('listMetadata', function(data, cb) {
    var opts = this._getOpts(data);
  });

}
