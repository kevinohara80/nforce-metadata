var stream  = require('stream');
var soap    = require('./lib/soap-client');
var Poller  = require('./lib/poller');
var Promise = require('bluebird');

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

      opts._resolver = resolver;

      self.meta._apiRequest(data, function(err, res) {
        if(err) return resolver.reject(err);
        else return resolver.resolve(null, res);
      });

    }

    if(opts.zipFile instanceof stream.Stream) {
      var bufs = [];
      opts.zipFile.on('data', function(d) {
        bufs.push(d);
      });
      opts.zipFile.on('end', function() {
        doDeploy(Buffer.concat(bufs).toString('base64'));
      });
      opts.zipFile.resume();
    } else if (opts.zipFile instanceof Buffer) {
      doDeploy(opts.zipFile.toString('base64'));
    } else if (opts.zipFile instanceof String || typeof opts.zipFile === 'string') {
      doDeploy(opts.zipFile);
    } else {
      throw new Error('invalid zipFile');
    }

    return resolver.promise;
  });

  plugin.fn('deployAndPoll', function(data, cb) {
    var self = this;
    var opts = this._getOpts(data);
    var resolver = createResolver(opts.callback);

    resolver.promise = resolver.promise || {};

    var poller = resolver.promise.poller = Poller.create({
      interval: self.metaOpts.pollInterval || 2000
    });

    opts.data = {
      ZipFile: opts.zipFile,
      DeployOptions: opts.deployOptions || opts.options || {}
    };

    this.meta.deploy(opts).then(function(res) {
      poller.opts.poll = function(cb) {
        self.meta.checkDeployStatus({
          id: res.id,
          includeDetails: opts.includeDetails,
          oauth: opts.oauth
        }, function(err, res) {
          if(err) cb(err);
          else cb(null, res);
        });
      };

      poller.on('done', resolver.resolve);
      poller.on('error', resolver.reject);

      poller.start();
    }).error(resolver.reject);

    return resolver.promise;
  });

  plugin.fn('checkDeployStatus', function(data, cb) {
    var opts = this._getOpts(data, cb);

    opts.data = {
      asyncProcessId: opts.asyncProcessId || opts.id,
      includeDetails: opts.includeDetails
    };

    opts.method = 'checkDeployStatus';

    return this.meta._apiRequest(opts, opts.callback);
  });

  plugin.fn('cancelDeploy', function(data, cb) {
    var opts = this._getOpts(data, cb);

    opts.data = {
      id: opts.id
    };

    opts.method = 'cancelDeploy';

    return this.meta._apiRequest(opts, opts.callback);
  });

  plugin.fn('cancelDeployAndPoll', function(data, cb) {
    var self = this;
    var opts = this._getOpts(data);
    var resolver = createResolver(opts.callback);

    resolver.promise = resolver.promise || {};

    var poller = resolver.promise.poller = Poller.create({
      interval: self.metaOpts.pollInterval || 2000
    });

    opts.data = {
      id: opts.id,
      includeDetails: opts.includeDetails
    };

    this.meta.cancelDeploy(opts).then(function(res) {
      poller.opts.poll = function(cb) {
        self.meta.checkDeployStatus({
          id: res.id,
          includeDetails: opts.includeDetails,
          oauth: opts.oauth
        }, function(err, res) {
          if(err) cb(err);
          else cb(null, res);
        });
      };

      poller.on('done', resolver.resolve);
      poller.on('error', resolver.reject);

      poller.start();
    }).error(resolver.reject);

    return resolver.promise;
  });

  /* retrieve api calls */

  plugin.fn('retrieve', function(data, cb) {
    var opts = this._getOpts(data);

    opts.data = {
      retrieveRequest: {
        apiVersion: opts.apiVersion || this.apiVersion.replace('v', ''),
        packageNames: opts.packageNames,
        singlePackage: opts.singlePackage,
        specificFiles: opts.specificFiles,
        unpackaged: opts.unpackaged
      }
    };

    opts.method = 'retrieve';

    return this.meta._apiRequest(opts, opts.callback);
  });

  plugin.fn('retrieveAndPoll', function(data, cb) {
    var self = this;
    var opts = this._getOpts(data);
    var resolver = createResolver(opts.callback);

    resolver.promise = resolver.promise || {};

    var poller = resolver.promise.poller = Poller.create({
      interval: self.metaOpts.pollInterval || 2000
    });

    opts.data = {
      retrieveRequest: {
        apiVersion: opts.apiVersion || this.apiVersion,
        packageNames: opts.packageNames,
        singlePackage: opts.singlePackage,
        specificFiles: opts.specificFiles,
        unpackaged: opts.unpackaged
      }
    };

    this.meta.retrieve(opts).then(function(res) {
      poller.opts.poll = function(cb) {
        self.meta.checkRetrieveStatus({
          id: res.id,
          oauth: opts.oauth
        }, function(err, res) {
          if(err) cb(err);
          else cb(null, res);
        });
      };

      poller.on('done', resolver.resolve);
      poller.on('error', resolver.reject);

      poller.start();
    }).error(resolver.reject);

    return resolver.promise;
  });

  plugin.fn('checkRetrieveStatus', function(data, cb) {
    var opts = this._getOpts(data, cb);

    opts.data = {
      id: opts.id
    };

    opts.method = 'checkRetrieveStatus';

    return this.meta._apiRequest(opts, opts.callback);
  });

  /* crud-based api calls */

  plugin.fn('createMetadata', function(data, cb) {
    var opts = this._getOpts(data, cb);

    var type = opts.type;

    opts.data = {
      metadata: _.map(opts.metadata, function(m) {
        m.$attributes = { 'xsi:type': type };
        return m;
      })
    };

    opts.method = 'createMetadata';

    return this.meta._apiRequest(opts, opts.callback);
  });

  plugin.fn('readMetadata', function(data, cb) {
    var opts = this._getOpts(data, cb);

    opts.data = {
      metadataType: opts.metadataType,
      fullNames: opts.fullNames
    };

    opts.method = 'readMetadata';

    return this.meta._apiRequest(opts, opts.callback);
  });

  plugin.fn('updateMetadata', function(data, cb) {
    var opts = this._getOpts(data);

    var type = opts.type;

    opts.data = {
      metadata: _.map(opts.metadata, function(m) {
        m.$attributes = { 'xsi:type': type };
        return m;
      })
    };

    opts.method = 'updateMetadata';

    return this.meta._apiRequest(opts, opts.callback);
  });

  plugin.fn('upsertMetadata', function(data, cb) {
    var opts = this._getOpts(data);

    var type = opts.type;

    opts.data = {
      metadata: _.map(opts.metadata, function(m) {
        m.$attributes = { 'xsi:type': type };
        return m;
      })
    };

    opts.method = 'upsertMetadata';

    return this.meta._apiRequest(opts, opts.callback);
  });

  plugin.fn('deleteMetadata', function(data, cb) {
    var opts = this._getOpts(data);

    opts.data = {
      metadataType: opts.type || opts.metadataType,
      fullNames: opts.fullNames
    };

    opts.method = 'deleteMetadata';

    return this.meta._apiRequest(opts, opts.callback);
  });

  plugin.fn('renameMetadata', function(data, cb) {
    var opts = this._getOpts(data);

    opts.data = {
      metadataType: opts.type || opts.metadataType,
      oldFullName: opts.old || opts.oldFullname,
      newFullName: opts.new || opts.newFullname
    };

    opts.method = 'renameMetadata';

    return this.meta._apiRequest(opts, opts.callback);
  });

  /* utility api calls */

  plugin.fn('describeMetadata', function(data, cb) {
    var opts = this._getOpts(data);
    var self = this;

    opts.data = {
      apiVersion: parseFloat(
        opts.apiVersion || self.apiVersion.replace('v', ''), 10
      )
    };

    opts.method = 'describeMetadata';

    return this.meta._apiRequest(opts, opts.callback);
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

    var requestOpts = {
      uri: opts.oauth.instance_url +
        '/services/Soap/m/' +
        self.apiVersion.replace('v', '')
    };

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
      }, requestOpts );
    }).error(function(err) {
      resolver.reject(err);
    });

    return resolver.promise;
  });

};
