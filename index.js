var soap = require('./lib/soap-client');

module.exports = function(nforce, name) {
  // throws if the plugin already exists
  var plugin = nforce.plugin(name || 'meta');

  // create local vars for some utils provided by nforce
  var _              = nforce.util._;
  var createResolver = nforce.util.promises.createResolver;

  /* describe api call */

  plugin.fn('describeApi', function(data, cb) {
    var opts     = this._getOpts(data, cb);
    var resolver = createResolver(opts.callback);

    this.meta._getSoapClient(data, function(err, client) {
      if(err) return resolver.reject(err);
      return resolver.resolve(client.describe());
    });

    return resolver.promise;
  });

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
    var opts = this._getOpts(data, cb);

    opts.data = {
      queries: opts.queries,
      asOfVersion: opts.asOfVersion
    };

    opts.method = 'listMetadata';

    return this.meta._apiRequest(opts, opts.callback);
  });

  /* low-level api calls */

  plugin.fn('_getSoapClient', function(data, cb) {
    var self     = this;
    var opts     = this._getOpts(data, cb);
    var resolver = createResolver(opts.callback);

    if(this.soapClient) {
      this.soapClient.setOAuth(opts.oauth);
      resolver.resolve(this.soapClient);
    } else {
      soap.createClient(opts.oauth, function(err, client) {
        if(err) return resolver.reject(err);
        self.soapClient = client;
        resolver.resolve(client);
      });
    }

    return resolver.promise;
  });

  plugin.fn('_apiRequest', function(data, cb) {
    var opts = this._getOpts(data);
    var resolver = opts._resolver || createResolver(opts.callback);

    this.meta._getSoapClient(opts).then(function(client) {
      client.MetadataService.Metadata[opts.method](opts.data, function(err, res) {
        if(err) return resolver.reject(err);
        else return resolver.resolve(res.result);
      });
    }).error(function(err) {
      resolver.reject(err);
    });

    return resolver.promise;
  });

};
