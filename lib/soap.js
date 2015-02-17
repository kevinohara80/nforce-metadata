var _ = require('lodash');

function writeXML(data, ns) {

  var xml = '';

  if(_.isObject(data)) {
    _.forOwn(data, function(val, key) {
      var s = '<' + ns + ':' + key + '>';
      var e = '</' + ns + ':' + key + '>';

      if(_.isUndefined(val)) {
        // do nothing
      } else if(_.isString(val)) {
        xml += s + val + e;
      } else if(_.isArray(val)) {
        _.each(val, function(v) {
          xml += s + writeXML(v, ns) + e;
        });
      } else {
        xml += s + writeXML(val, ns) + e;
      }
    });
  } else {
    return xml = data;
  }

  return xml;
}

module.exports.createMessage = function(opts) {

  var body = writeXML(opts.data, 'tns');

  return [
    '<?xml version="1.0" encoding="utf-8"?>',
    '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"',
    ' xmlns:urn="http://soap.sforce.com/2006/04/metadata"',
    ' xmlns:tns="http://soap.sforce.com/2006/04/metadata">',
    '<soapenv:Header>',
    '<urn:SessionHeader xmlns="http://soap.sforce.com/2006/04/metadata">',
    '<urn:sessionId>' + opts.oauth.access_token + '</urn:sessionId>',
    '</urn:SessionHeader>',
    '</soapenv:Header>',
    '<soapenv:Body>',
    body,
    '</soapenv:Body>',
    '</soapenv:Envelope>'
  ].join('')

}

// <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:tns="http://soap.sforce.com/2006/04/metadata">
//   <soap:Header>
//     <urn:SessionHeader xmlns:urn="http://soap.sforce.com/2006/04/metadata" xmlns="http://soap.sforce.com/2006/04/metadata">
//       <urn:sessionId>00Dd0000000fOlW!ARkAQMjg9.TYrX1qTEQPkJWHPy8lWJ4.Ipw7DjbhJQKG6Ctvm1jSfp82wUeEkrEWBzrVsaKHBuzCevMT__Qou2tcqDvZeIsC</urn:sessionId>
//     </urn:SessionHeader>
//   </soap:Header>
//   <soap:Body>
//     <tns:listMetadata xmlns:tns="http://soap.sforce.com/2006/04/metadata" xmlns="http://soap.sforce.com/2006/04/metadata">
//       <tns:queries>
//         <tns:type>CustomObject</tns:type>
//       </tns:queries>
//       <tns:queries>
//         <tns:type>ApexClass</tns:type>
//       </tns:queries>
//       <tns:queries>
//         <tns:type>ApexPage</tns:type>
//       </tns:queries>
//     </tns:listMetadata>
//   </soap:Body>
// </soap:Envelope>
