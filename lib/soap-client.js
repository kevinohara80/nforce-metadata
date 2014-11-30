var soap = require('soap');
var path = require('path');
var wsdl = path.resolve(__dirname, './wsdl/metadata.wsdl');

module.exports.createClient = function(oauth, cb) {

  soap.createClient(wsdl, function(err, client) {
    if(err) return cb(err);

    var header = {
      'SessionHeader': {
        'sessionId': oauth.access_token
      }
    };

    var name = '';
    var xmlns = 'http://soap.sforce.com/2006/04/metadata';
    var ns = 'urn';

    client.addSoapHeader(header, name, ns, xmlns);
    return cb(null, client);
  });

};
