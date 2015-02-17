var stream      = require('stream');
var soapClient  = require('./lib/soap-client');
var Poller      = require('./lib/poller');
var Promise     = require('bluebird');
var request     = require('request');
var soap        = require('./lib/soap');
var parseString = require('xml2js').parseString;

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
          includeDeleted: opts.includeDeleted
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
    var opts = this._getOpts(data);

    opts.data = {
      id: opts.id
    };

    opts.method = 'cancelDeploy';

    return this.meta._apiRequest(opts, opts.callback);
  });

  /* retrieve api calls */

  plugin.fn('retrieve', function(data, cb) {
    var opts = this._getOpts(data);

    opts.data = {
      apiVersion:    opts.apiVersion,
      packageNames:  opts.packageNames,
      singlePackage: opts.singlePackage,
      specificFiles: opts.specificFiles,
      unpackaged:    opts.unpackaged
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
      apiVersion:    opts.apiVersion,
      packageNames:  opts.packageNames,
      singlePackage: opts.singlePackage,
      specificFiles: opts.specificFiles,
      unpackaged:    opts.unpackaged
    };

    this.meta.retrieve(opts).then(function(res) {
      poller.opts.poll = function(cb) {
        self.meta.checkRetrieveStatus({
          id: res.id
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
    var opts = this._getOpts(data);

    opts.data = {
      id: opts.id
    };

    opts.method = 'checkRetrieveStatus';

    return this.meta._apiRequest(opts, opts.callback);

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
      listMetadata: {
        queries: opts.queries,
        asOfVersion: opts.asOfVersion
      }
    };

    return this.meta._apiRequest(opts, opts.callback);
  });

  /* low-level api calls */

  plugin.fn('_getEndpoint', function(oauth){
    return oauth.instance_url +
      '/services/Soap/m/' +
      this.apiVersion.replace('v', '');
  });

  plugin.fn('_apiRequest', function(data, cb) {
    var self     = this;
    var opts     = this._getOpts(data, cb);
    var resolver = opts._resolver || createResolver(opts.callback);

    var endpoint = this.meta._getEndpoint(opts.oauth);

    var ropts = {
      headers: {
        'Content-Type': 'text/xml',
        'SOAPAction': '""'
      },
      method: 'POST',
      uri: endpoint,
      body: soap.createMessage({
        oauth: opts.oauth,
        method: opts.method,
        data: opts.data
      })
    };

    request(ropts, function(err, res) {
      if(err) return resolver.reject(err);
      parseString(res.body, function (err, result) {
        resolver.resolve(result);
      });
    });
    return resolver.promise;

    // this.meta._getSoapClient(opts).then(function(client) {
    //
    //   client.on('request', function(a, b) {
    //     console.log(a);
    //     console.log(self.meta._getEndpoint(opts.oauth));
    //   });
    //
    //   client.MetadataService.Metadata[opts.method](opts.data, function(err, res) {
    //     if(err) {
    //       if(/INVALID\_SESSION\_ID/.test(err.message) &&
    //         self.autoRefresh === true &&
    //         (opts.oauth.refresh_token || (self.getUsername() && self.getPassword())) &&
    //         !opts._retryCount) {
    //
    //         self.autoRefreshToken.call(self, opts, function(err2, res2) {
    //           if(err2) {
    //             return resolver.reject(err2);
    //           } else {
    //             opts._retryCount = 1;
    //             opts._resolver = resolver;
    //             return self.meta._apiRequest.call(self, opts);
    //           }
    //         });
    //
    //       } else {
    //         //console.log(client.lastRequest);
    //         resolver.reject(err);
    //       }
    //     } else {
    //       //console.log(client.lastRequest);
    //       return resolver.resolve(res.result);
    //     }
    //   });
    // }).error(function(err) {
    //   resolver.reject(err);
    // });
    //
    // return resolver.promise;
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
