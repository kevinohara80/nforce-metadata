var stream = require('stream');
var soap   = require('./lib/soap-client');

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
    var self     = this;
    var opts     = this._getOpts(data, cb);
    var resolver = createResolver(opts.callback);

    opts.method = 'deploy';

    function doDeploy(zipInput) {

      opts.data = {
        'ZipFile': zipInput,
        'DeployOptions': opts.deployOptions || opts.options || {}
      };

      console.log(opts.data);

      opts._resolver = resolver;

      self.meta._apiRequest(data, function(err, res) {
        if(err) return resolver.reject(err);
        else return resolver.resolve(null, res);
      });

    }

    if(opts.zipFile instanceof stream.Stream) {
      this.meta._log('is a zip stream');
      var bufs = [];
      opts.zipFile.on('data', function(d) {
        bufs.push(d);
      });
      opts.zipFile.on('end', function() {
        self.meta._log('zip stream end');
        doDeploy(Buffer.concat(bufs).toString('base64'));
      });
      opts.zipFile.resume();
    } else if (opts.zipFile instanceof Buffer) {
      this.meta._log('is a buffer');
      doDeploy(opts.zipFile.toString('base64'));
    } else if (opts.zipFile instanceof String || typeof opts.zipFile === 'string') {
      this.meta._log('is a string');
      doDeploy(opts.zipFile);
    } else {
      throw new Error('invalid zipFile');
    }

    return resolver.promise;
  });

  plugin.fn('checkDeployStatus', function(data, cb) {
    var opts = this._getOpts(data);

    opts.data = {
      asyncProcessId: opts.asyncProcessId || opts.id,
      includeDetails: opts.includeDetails
    }

    opts.method = 'checkDeployStatus';

    return this.meta._apiRequest(opts, opts.callback);
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
    var self     = this;
    var opts     = this._getOpts(data, cb);
    var resolver = opts._resolver || createResolver(opts.callback);

    this.meta._getSoapClient(opts).then(function(client) {
      client.MetadataService.Metadata[opts.method](opts.data, function(err, res) {
        if(err) {
          if(/INVALID\_SESSION\_ID/.test(err.message) &&
          self.autoRefresh === true &&
          (opts.oauth.refresh_token || (self.getUsername() && self.getPassword())) &&
          !opts._retryCount) {

            self.autoRefreshToken.call(self, opts, function(err2, res2) {
              if(err2) {
                return resolver.reject(err2);
              } else {
                opts._retryCount = 1;
                opts._resolver = resolver;
                return self.meta._apiRequest.call(self, opts);
              }
            });

          } else {
            resolver.reject(err);
          }
        } else {
          return resolver.resolve(res.result);
        }
      });
    }).error(function(err) {
      resolver.reject(err);
    });

    return resolver.promise;
  });

  /* logger methods */

  plugin.fn('_log', function(msg) {
    if(this.debug === true) {
      console.log('[meta][log]: ' + msg);
    }
  });

  plugin.fn('_logErr', function(msg) {
    if(this.debug === true) {
      console.log('[meta][err]: ' + msg);
    }
  });

};
