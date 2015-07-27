var soap = require('soap');
var path = require('path');
var _    = require('lodash');
var wsdl = path.resolve(__dirname, './wsdl/metadata.wsdl');

module.exports.createClient = function(oauth, cb) {

  var opts = {
    attributesKey: '$attributes',
    endpoint: oauth.instance_url + '/services/Soap/m/32.0'
  };

  soap.createClient(wsdl, opts, function(err, client) {
    if(err) return cb(err);

    client.setOAuth = function(oa) {
      client.oauth = oa;

      var header = {
        'SessionHeader': {
          'sessionId': oa.access_token
        }
      };

      var xmlns = 'http://soap.sforce.com/2006/04/metadata';

      client.addSoapHeader(header, '', 'tns', xmlns);
    };

    client.setOAuth(oauth);

    return cb(null, client);
  });

};
