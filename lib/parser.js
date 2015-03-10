var _ = require('lodash');

var types = {
  bool:     1,
  double:   2,
  integer:  3,
  string:   4,
  datetime: 5
};

var mdTypes = {

  ActionOverride: {
    actionName:           types.string,
    comment:              types.string,
    content:              types.string,
    skipRecordTypeSelect: types.bool,
    type:                 types.string
  },

  AsyncResult: {
    done:       types.bool,
    id:         types.string,
    state:      types.string,
    statusCode: types.string
  },

  BusinessProcess: {
    description:     types.string,
    fullName:        types.string,
    isActive:        types.bool,
    namespacePrefix: types.string,
    values:          [ 'PicklistValue' ]
  },

  CancelDeployResult: {
    done: types.bool,
    id:   types.string
  },

  CodeCoverageResult: {
    dmlInfo:             [ 'CodeLocation' ],
    id:                  types.string,
    locationsNotCovered: [ 'CodeLocation' ],
    methodInfo:          [ 'CodeLocation' ],
    name:                types.string,
    namespace:           types.string,
    numLocations:        types.integer,
    soqlInfo:            [ 'CodeLocation' ],
    type:                types.string
  },

  CodeCoverageWarning: {
    id:        types.string,
    message:   types.string,
    name:      types.string,
    namespace: types.string
  },

  CodeLocation: {
    column:        types.integer,
    line:          types.integer,
    numExecutions: types.integer,
    time:          types.double
  },

  CompactLayout: {
    field: types.string,
    label: types.string
  },

  CustomObject: {
    actionOverrides:            [ 'ActionOverride' ],
    businessProcesses:          [ 'BusinessProcess' ],
    compactLayoutAssignment:    types.string,
    compactLayouts:             [ 'CompactLayout' ],
    customHelp:                 types.string,
    customHelpPage:             types.string,
    customSettingsType:         types.string,
    customSettingsVisibility:   types.string,
    deploymentStatus:           types.string,
    deprecated:                 types.bool,
    description:                types.string,
    enableActivities:           types.bool,
    enableBulkApi:              types.bool,
    enableDivisions:            types.bool,
    enableEnhancedLookup:       types.bool,
    enableFeeds:                types.bool,
    enableHistory:              types.bool,
    enableReports:              types.bool,
    enableSharing:              types.bool,
    enableStreamingApi:         types.bool,
    externalDataSource:         types.string,
    externalName:               types.string,
    externalRepository:         types.string,
    externalSharingModel:       types.string,
    fields:                     [ 'CustomField' ],
    fieldSets:                  'FieldSet',
    fullName:                   types.string,
    gender:                     'Gender',
    household:                  types.bool,
    historyRetentionPolicy:     'HistoryRetentionPolicy',
    label:                      types.string,
    listViews:                  [ 'ListView' ],
    namedFilter:                [ 'NamedFilter' ],
    nameField:                  'CustomField',
    pluralLabel:                types.string,
    recordTypes:                [ 'RecordType' ],
    recordTypeTrackFeedHistory: types.bool,
    recordTypeTrackHistory:     types.bool,
    searchLayouts:              'SearchLayouts',
    sharingModel:               'SharingModel',
    sharingReasons:             [ 'SharingReason' ],
    sharingRecalculations:      [ 'SharingRecalculation' ],
    startsWith:                 types.string,
    validationRules:            [ 'ValidationRule' ],
    webLinks:                   [ 'WebLink' ]
  },

  DeployDetails: {
    id:                 types.string,
    messages:           [ 'DeployMessage' ],
    componentFailures:  [ 'DeployMessage' ],
    componentSuccesses: [ 'DeployMessage' ],
    retrieveResult:     'RetrieveResult',
    runTestResult:      'RunTestResult',
    success:            types.bool
  },

  DeployMessage: {
    changed:       types.bool,
    columnNumber:  types.integer,
    componentType: types.string,
    created:       types.bool,
    createdDate:   types.datetime,
    deleted:       types.bool,
    fileName:      types.string,
    fullName:      types.string,
    id:            types.string,
    lineNumber:    types.integer,
    problem:       types.string,
    problemType:   types.string,
    success:       types.bool
  },

  DeployResult: {
    id:                       types.string,
    canceledBy:               types.string,
    canceledByName:           types.string,
    checkOnly:                types.bool,
    completedDate:            types.datetime,
    createdBy:                types.string,
    createdByName:            types.string,
    createdDate:              types.datetime,
    details:                  [ 'DeployDetails' ],
    done:                     types.bool,
    errorMessage:             types.string,
    errorStatusCode:          types.string,
    ignoreWarnings:           types.bool,
    lastModifiedDate:         types.datetime,
    numberComponentErrors:    types.integer,
    numberComponentsDeployed: types.integer,
    numberComponentsTotal:    types.integer,
    numberTestErrors:         types.integer,
    numberTestsCompleted:     types.integer,
    numberTestsTotal:         types.integer,
    runTestsEnabled:          types.boolean,
    rollbackOnError:          types.boolean,
    startDate:                types.datetime,
    stateDetail:              types.string,
    status:                   types.string,
    success:                  types.bool
  },

  Error: {
    fields:     [ types.string ],
    message:    types.string,
    statusCode: types.string
  },

  FileProperties: {
    createdById:        types.string,
    createdByName:      types.string,
    createdDate:        types.datetime,
    fileName:           types.string,
    fullName:           types.string,
    id:                 types.string,
    lastModifiedById:   types.string,
    lastModifiedByName: types.string,
    lastModifiedDate:   types.datetime,
    manageableState:    types.string,
    namespacePrefix:    types.string,
    type:               types.string
  },

  Metadata: {
    fullName: types.string
  },

  ReadResult: {
    records: [ 'Metadata' ]
  },

  RetrieveMessage: {
    fileName: types.string,
    problem:  types.string
  },

  RetrieveResult: {
    done:            types.bool,
    errorMessage:    types.string,
    errorStatusCode: types.string,
    fileProperties:  [ 'FileProperties' ],
    id:              types.string,
    messages:        [ 'RetrieveMessage' ],
    status:          types.string,
    success:         types.bool,
    zipFile:         types.string // could argue that this should be a buffer
  },

  RunTestFailure: {
    id:         types.string,
    message:    types.string,
    methodName: types.string,
    name:       types.string,
    namespace:  types.string,
    seeAllData: types.bool,
    stackTrace: types.string,
    time:       types.double,
    type:       types.string
  },

  RunTestResult: {
    codeCoverage:          [ 'CodeCoverageResult' ],
    codeCoverageWarnings:  [ 'CodeCoverageWarning' ],
    failures:              [ 'RunTestFailure' ],
    numFailures:           types.integer,
    numTestsRun:           types.integer,
    successes:             [ 'RunTestSuccess' ],
    totalTime:             types.double
  },

  RunTestSuccess: {
    id:         types.string,
    methodName: types.string,
    name:       types.string,
    namespace:  types.string,
    seeAllData: types.bool,
    time:       types.double
  },

  SaveResult: {
    errors:   [ 'Error' ],
    fullName: types.string,
    success:  types.bool
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
    return parseElement(v, map[k])
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
}
