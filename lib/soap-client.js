var soap = require('soap');
var path = require('path');
var _    = require('lodash');
var wsdl = path.resolve(__dirname, './wsdl/metadata.wsdl');

module.exports.createClient = function(oauth, cb) {

  soap.createClient(wsdl, function(err, client) {
    if(err) return cb(err);

    client.setOAuth = function(oa) {
      client.oauth = oa;

      var header = {
        'SessionHeader': {
          'sessionId': oa.access_token
        }
      };

      var xmlns = 'http://soap.sforce.com/2006/04/metadata';

      client.addSoapHeader(header, '', 'urn', xmlns);
    };

    client.setOAuth(oauth);

    return cb(null, client);
  });

};
