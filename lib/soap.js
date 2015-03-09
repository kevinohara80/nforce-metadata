var _           = require('lodash');
var xmlbuilder  = require('xmlbuilder');
var parseString = require('xml2js').parseString;

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

var SoapMessage = function(opts) {
  opts = opts || {};
  this._soapHeaders = opts.soapHeaders;
  this._sessionId = (opts.oauth) ? opts.oauth.access_token : opts.sessionId
  this._body = opts.body;
  this._xmlns = opts.xmlns || 'http://soap.sforce.com/2006/04/metadata';
  this._envelopeData = opts.envelopeData;
  this._data = opts.data;
};

SoapMessage.prototype.setSessionId = function(oauth) {
  this._sessionId = (_.isObject(oauth)) ? oauth.access_token : oauth;
  return this;
};

SoapMessage.prototype.getSessionId = function() {
  return this._sessionId;
};

SoapMessage.prototype.setSoapHeader = function(header, data) {
  this._soapHeaders[header] = data;
  return this;
};

SoapMessage.prototype.getSoapHeader = function(header) {
  return this._soapHeaders[header];
};

SoapMessage.prototype.envelope = function() {
  return [
    '<?xml version="1.0" encoding="utf-8"?>',
    '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"',
    ' xmlns:urn="http://soap.sforce.com/2006/04/metadata"',
    ' xmlns:tns="http://soap.sforce.com/2006/04/metadata">',
    '<soapenv:Header>',
    '<urn:SessionHeader xmlns="http://soap.sforce.com/2006/04/metadata">',
    '<urn:sessionId>' + this._sessionId + '</urn:sessionId>',
    '</urn:SessionHeader>',
    '</soapenv:Header>',
    '<soapenv:Body>',
    writeXML(this.getData(), 'tns'),
    '</soapenv:Body>',
    '</soapenv:Envelope>'
  ].join('');
};

SoapMessage.prototype.setEnvelopeData = function(body) {
  this._envelopeData = body;
  return this;
};

SoapMessage.prototype.getBody = function() {
  if(this._envelopeData) {
    return this._envelopeData['soapenv:Envelope']['soapenv:Body'][0];
  }
};

SoapMessage.prototype.isError = function() {
  var body = this.getBody();
  if(body['soapenv:Fault']) return true;
  return false;
};

SoapMessage.prototype.getErrorMessage = function() {
  if(this.isError()) {
    return this.getBody()['soapenv:Fault'][0]['faultcode'][0];
  }
};

SoapMessage.prototype.getError = function() {
  if(this.isError()) {
    var fault = this.getBody()['soapenv:Fault'][0];
    var err = new Error(fault['faultstring'][0]);
    err.faultCode = fault['faultcode'][0];
    return err;
  }
}

SoapMessage.prototype.isExpiredSession = function() {
  if(!this.isError()) return false;
  var faultMsg = this.getBody()['soapenv:Fault'][0]['faultcode'][0];
  return /INVALID\_SESSION\_ID/i.test(faultMsg);
};

SoapMessage.prototype.getData = function() {
  return this._data;
};

SoapMessage.prototype.parseEnvelope = function(raw, cb) {
  var self = this;
  this._raw = raw || this._raw;
};

/*
 * Soaphandler
 */

var SoapHandler = function(opts) {
  this._opts = _.default(opts || {}, {
    ns: 'tns',
    xmlns: 'http://soap.sforce.com/2006/04/metadata'
  });
};

module.exports.parseMessage = function(raw, cb) {
  var msg = new SoapMessage();
  parseString(raw, function(err, parsed) {
    if(err) return cb(err);
    msg.setEnvelopeData(parsed)
    cb(null, msg);
  });
};

module.exports.createMessage = function(opts) {
  var msg = new SoapMessage(opts);
  return msg;
};
