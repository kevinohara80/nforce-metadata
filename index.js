var _ = require('lodash');

module.exports = function(nforce, name) {
  // throws if the plugin already exists
  var plugin = nforce.plugin(name || 'meta');

  /* deploy api calls */
  
  plugin.fn('deploy', function(data, cb) {
    var opts = this._getOpts(data);
  });

  plugin.fn('checkDeployStatus', function(data, cb) {
    var opts = this._getOpts(data);
  });

  plugin.fn('cancelDeploy', function(data, cb) {
    var opts = this._getOpts(data);
  });

  /* retrieve api calls */

  plugin.fn('retrieve', function(data, cb) {
    var opts = this._getOpts(data);
  });

  plugin.fn('checkRetrieveStatus', function(data, cb) {
    var opts = this._getOpts(data);
  });

  /* crud-based api calls */

  plugin.fn('createMetadata', function(data, cb) {
    var opts = this._getOpts(data);
  });

  plugin.fn('readMetadata', function(data, cb) {
    var opts = this._getOpts(data);
  });

  plugin.fn('updateMetadata', function(data, cb) {
    var opts = this._getOpts(data);
  });

  plugin.fn('upsertMetadata', function(data, cb) {
    var opts = this._getOpts(data);
  });

  plugin.fn('deleteMetadata', function(data, cb) {
    var opts = this._getOpts(data);
  });

  plugin.fn('renameMetadata', function(data, cb) {
    var opts = this._getOpts(data);
  });

  plugin.fn('create', function(data, cb) {
    var opts = this._getOpts(data);
  });

  plugin.fn('delete', function(data, cb) {
    var opts = this._getOpts(data);
  });

  plugin.fn('update', function(data, cb) {
    var opts = this._getOpts(data);
  });

  /* utility api calls */

  plugin.fn('checkStatus', function(data, cb) {
    var opts = this._getOpts(data);
  });

  plugin.fn('describeMetadata', function(data, cb) {
    var opts = this._getOpts(data);
  });

  plugin.fn('listMetadata', function(data, cb) {
    var opts = this._getOpts(data);
  });

  /* low-level api calls */

  plugin.fn('_metadataApiCall', function(data, cb) {

  });

};
