var _ = require('lodash');

var types = {
  bool:    1,
  double:  2,
  integer: 3,
  string:  4
};

var mdTypes = {

  AsyncResult: {
    done:       types.bool,
    id:         types.string,
    state:      types.string,
    statusCode: types.string
  }
};

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

/* parsing functions */

function parseArray(arr, map) {
  return _.map(arr, function(v, k) {
    return parseElement(v, map[0]);
  });
}

function parseObject(obj, map) {
  return _.mapValues(obj, function(v, k) {
    return parseElement(v, map[k])
  });
}

function parseElement(obj, map) {
  // flatten arrays that should not be arrays
  if(_.isArray(obj) && !_.isArray(map)) {
    obj = obj[0];
  }

  if(_.isArray(map))        return parseArray(obj, map);
  if(_.isObject(map))       return parseObject(obj, map);
  if(map === types.bool)    return toBool(obj);
  if(map === types.double)  return toDouble(obj);
  if(map === types.integer) return toInteger(obj);
  if(map === types.string)  return obj;

  return obj;
}

/* exports */

module.exports = function(mdType, obj) {
  if(!mdTypes[mdType]) throw new Error('invalid type: ' + mdType);
  return parseElement(obj, mdTypes[mdType]);
}
