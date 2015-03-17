var _  = require('lodash');
var md = require('./md');

var types   = md.types;
var mdTypes = md.mdTypes;

/* type conversion functions */

function toBool(val) {
  if(_.isUndefined(val)) return null;
  if(_.isString(val)) {
    val = val.toLowerCase().trim();
    if(val === 'true' || val === 1) return true;
    if(val === 'false' || val === 0) return false;
  }
}

function toDouble(val) {
  if(_.isUndefined(val)) return null;
  try {
    return parseFloat(val, 10);
  } catch (err) {}
  return null;
}

function toInteger(val) {
  if(_.isUndefined(val)) return null;
  try {
    return parseInt(val, 10);
  } catch (err) {}
  return null;
}

function toDateTime(val) {
  if(_.isUndefined(val)) return null;
  try {
    return new Date(val);
  } catch (err) {}
  return null;
}

/* parsing functions */

function parseArray(arr, map) {
  return _.map(arr, function(v, k) {
    return parseElement(v, map[0]);
  });
}

function parseObject(obj, map) {
  return _.mapValues(obj, function(v, k) {
    //console.log('mapping ' + map + ' with k:v ' + k + ':' + v);

    if(k === 'fields') {
      // console.log('************');
      // console.dir(map);
      // console.log('searching for ' + k);
      // console.dir(map[k]);
      // console.log('************');
    }
    // using a $ to escape reserved keywords
    // like length
    return parseElement(v, map['$' + k] || map[k]);
  });
}

function parseElement(obj, map) {

  // support arrays like FileProperties[]
  if(/\[\]$/.test(map)) {
    map = [map.replace('[]', '')];
  }

  // flatten arrays that should not be arrays
  if(_.isArray(obj) && !_.isArray(map)) {
    obj = obj[0];
  }

  if(_.isString(map)) {
    if(!mdTypes[map]) {
      throw new Error('Type not found in map: ' + map);
    }
    map = mdTypes[map];
  }

  if(_.isArray(map))         return parseArray(obj, map);
  if(_.isObject(map))        return parseObject(obj, map);
  if(map === types.bool)     return toBool(obj);
  if(map === types.double)   return toDouble(obj);
  if(map === types.integer)  return toInteger(obj);
  if(map === types.datetime) return toDateTime(obj);
  if(map === types.string)   return obj;

  return obj;
}

/* exports */

module.exports = function(mdType, obj) {
  if(!mdTypes[mdType.replace('[]', '')]) {
    throw new Error('invalid type: ' + mdType);
  }
  return parseElement(obj, mdType);
};

module.exports.mdTypes = mdTypes;
