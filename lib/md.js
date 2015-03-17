var types = module.exports.types = {
  bool:     1,
  double:   2,
  integer:  3,
  string:   4,
  datetime: 5
};

module.exports.mdTypes = {

  ActionOverride: {
    actionName           : types.string,
    comment              : types.string,
    content              : types.string,
    skipRecordTypeSelect : types.bool,
    type                 : types.string
  },

  AsyncResult: {
    done       : types.bool,
    id         : types.string,
    state      : types.string,
    statusCode : types.string
  },

  BusinessProcess: {
    description     : types.string,
    fullName        : types.string,
    isActive        : types.bool,
    namespacePrefix : types.string,
    values          : [ 'PicklistValue' ]
  },

  CancelDeployResult: {
    done : types.bool,
    id   : types.string
  },

  CodeCoverageResult: {
    dmlInfo             : [ 'CodeLocation' ],
    id                  : types.string,
    locationsNotCovered : [ 'CodeLocation' ],
    methodInfo          : [ 'CodeLocation' ],
    name                : types.string,
    namespace           : types.string,
    numLocations        : types.integer,
    soqlInfo            : [ 'CodeLocation' ],
    type                : types.string
  },

  CodeCoverageWarning: {
    id        : types.string,
    message   : types.string,
    name      : types.string,
    namespace : types.string
  },

  CodeLocation: {
    column        : types.integer,
    line          : types.integer,
    numExecutions : types.integer,
    time          : types.double
  },

  CompactLayout: {
    field : types.string,
    label : types.string
  },

  CustomField: {
    caseSensitive            : types.bool,
    defaultValue             : types.string,
    deleteConstraint         : types.string,
    deprecated               : types.bool,
    description              : types.string,
    displayFormat            : types.string,
    displayLocationInDecimal : types.bool,
    externalDeveloperName    : types.string,
    externalId               : types.bool,
    formula                  : types.string,
    formulaTreatBlankAs      : types.string,
    fullName                 : types.string,
    indexed                  : types.bool,
    inlineHelpText           : types.string,
    isFilteringDisabled      : types.bool,
    isNameField              : types.bool,
    isSortingDisabled        : types.bool,
    reparentableMasterDetail : types.bool,
    label                    : types.string,
    '$length'                : types.integer,
    lookupFilter             : 'LookupFilter',
    maskChar                 : types.string,
    maskType                 : types.string,
    picklist                 : 'Picklist',
    populateExistingRows     : types.bool,
    precision                : types.integer,
    referenceTargetField     : types.string,
    referenceTo              : types.string,
    relationshipLabel        : types.string,
    relationshipName         : types.string,
    relationshipOrder        : types.integer,
    required                 : types.bool,
    scale                    : types.integer,
    startingNumber           : types.integer,
    stripMarkup              : types.bool,
    summarizedField          : types.string,
    summaryFilterItems       : [ 'FilterItem' ],
    summaryForeignKey        : types.string,
    summaryOperation         : types.string,
    trackFeedHistory         : types.bool,
    trackHistory             : types.bool,
    trackTrending            : types.bool,
    trueValueIndexed         : types.bool,
    type                     : types.string,
    unique                   : types.bool,
    visibleLines             : types.integer,
    writeRequiresMasterRead  : types.bool
  },

  CustomObject: {
    actionOverrides            : [ 'ActionOverride' ],
    businessProcesses          : [ 'BusinessProcess' ],
    compactLayoutAssignment    : types.string,
    compactLayouts             : [ 'CompactLayout' ],
    customHelp                 : types.string,
    customHelpPage             : types.string,
    customSettingsType         : types.string,
    customSettingsVisibility   : types.string,
    deploymentStatus           : types.string,
    deprecated                 : types.bool,
    description                : types.string,
    enableActivities           : types.bool,
    enableBulkApi              : types.bool,
    enableDivisions            : types.bool,
    enableEnhancedLookup       : types.bool,
    enableFeeds                : types.bool,
    enableHistory              : types.bool,
    enableReports              : types.bool,
    enableSharing              : types.bool,
    enableStreamingApi         : types.bool,
    externalDataSource         : types.string,
    externalName               : types.string,
    externalRepository         : types.string,
    externalSharingModel       : types.string,
    fields                     : [ 'CustomField' ],
    fieldSets                  : 'FieldSet',
    fullName                   : types.string,
    gender                     : types.string,
    household                  : types.bool,
    historyRetentionPolicy     : 'HistoryRetentionPolicy',
    label                      : types.string,
    listViews                  : [ 'ListView' ],
    namedFilter                : [ 'NamedFilter' ],
    nameField                  : 'CustomField',
    pluralLabel                : types.string,
    recordTypes                : [ 'RecordType' ],
    recordTypeTrackFeedHistory : types.bool,
    recordTypeTrackHistory     : types.bool,
    searchLayouts              : 'SearchLayouts',
    sharingModel               : types.string,
    sharingReasons             : [ 'SharingReason' ],
    sharingRecalculations      : [ 'SharingRecalculation' ],
    startsWith                 : types.string,
    validationRules            : [ 'ValidationRule' ],
    webLinks                   : [ 'WebLink' ]
  },

  DeployDetails: {
    id                 : types.string,
    messages           : [ 'DeployMessage' ],
    componentFailures  : [ 'DeployMessage' ],
    componentSuccesses : [ 'DeployMessage' ],
    retrieveResult     : 'RetrieveResult',
    runTestResult      : 'RunTestResult',
    success            : types.bool
  },

  DeployMessage: {
    changed       : types.bool,
    columnNumber  : types.integer,
    componentType : types.string,
    created       : types.bool,
    createdDate   : types.datetime,
    deleted       : types.bool,
    fileName      : types.string,
    fullName      : types.string,
    id            : types.string,
    lineNumber    : types.integer,
    problem       : types.string,
    problemType   : types.string,
    success       : types.bool
  },

  DeployResult: {
    id                       : types.string,
    canceledBy               : types.string,
    canceledByName           : types.string,
    checkOnly                : types.bool,
    completedDate            : types.datetime,
    createdBy                : types.string,
    createdByName            : types.string,
    createdDate              : types.datetime,
    details                  : [ 'DeployDetails' ],
    done                     : types.bool,
    errorMessage             : types.string,
    errorStatusCode          : types.string,
    ignoreWarnings           : types.bool,
    lastModifiedDate         : types.datetime,
    numberComponentErrors    : types.integer,
    numberComponentsDeployed : types.integer,
    numberComponentsTotal    : types.integer,
    numberTestErrors         : types.integer,
    numberTestsCompleted     : types.integer,
    numberTestsTotal         : types.integer,
    runTestsEnabled          : types.bool,
    rollbackOnError          : types.bool,
    startDate                : types.datetime,
    stateDetail              : types.string,
    status                   : types.string,
    success                  : types.bool
  },

  Error: {
    fields     : [ types.string ],
    message    : types.string,
    statusCode : types.string
  },

  FieldSet: {
    availableFields : [ 'FieldSetItem' ],
    description     : types.string,
    displayedFields : [ 'FieldSetItem' ],
    label           : types.string
  },

  FieldSetItem: {
    field          : types.string,
    isFieldManaged : types.bool,
    isRequired     : types.bool
  },

  FileProperties: {
    createdById        : types.string,
    createdByName      : types.string,
    createdDate        : types.datetime,
    fileName           : types.string,
    fullName           : types.string,
    id                 : types.string,
    lastModifiedById   : types.string,
    lastModifiedByName : types.string,
    lastModifiedDate   : types.datetime,
    manageableState    : types.string,
    namespacePrefix    : types.string,
    type               : types.string
  },

  FilterItem: {
    field      : types.string,
    operation  : types.string,
    value      : types.string,
    valueField : types.string
  },

  HistoryRetentionPolicy: {
    archiveAfterMonths    : types.integer,
    archiveRetentionYears : types.integer,
    description           : types.string,
    gracePeriodDays       : types.integer
  },

  ListView: {
    booleanFilter : types.string,
    columns       : [ types.string ],
    division      : types.string,
    filterScope   : types.string,
    filters       : [ 'ListViewFilter' ],
    fullName      : types.string,
    label         : types.string,
    language      : types.string,
    queue         : types.string,
    sharedTo      : 'SharedTo'
  },

  ListViewFilter: {
    filter    : types.string,
    operation : types.string,
    value     : types.string
  },

  LookupFilter: {
    active        : types.bool,
    booleanFilter : types.string,
    description   : types.string,
    errorMessage  : types.string,
    filterItems   : [ 'FilterItem' ],
    infoMessage   : types.string,
    isOptional    : types.bool
  },

  Metadata: {
    fullName : types.string
  },

  NamedFilter: {
    active        : types.bool,
    booleanFilter : types.string,
    description   : types.string,
    errorMessage  : types.string,
    field         : types.string,
    filterItems   : [ 'FilterItem' ],
    infoMessage   : types.string,
    fullName      : types.string,
    isOptional    : types.bool,
    name          : types.string,
    sourceObject  : types.string
  },

  Picklist: {
    controllingField : types.string,
    picklistValues   : [ 'PicklistValue' ],
    sorted           : types.bool
  },

  PicklistValue: {
    allowEmail             : types.bool,
    closed                 : types.bool,
    color                  : types.string,
    controllingFieldValues : [ types.string ],
    converted              : types.bool,
    cssExposed             : types.bool,
    '$default'             : types.bool,
    description            : types.string,
    forecastCategory       : types.string,
    fullName               : types.string,
    highPriority           : types.bool,
    probability            : types.integer,
    reverseRole            : types.string,
    reviewed               : types.bool,
    won                    : types.bool,
  },

  ReadResult: {
    records : [ 'Metadata' ]
  },

  RecordType: {
    active                  : types.bool,
    businessProcess         : types.string,
    compactLayoutAssignment : types.string,
    description             : types.string,
    fullName                : types.string,
    label                   : types.string,
    picklistValues          : [ 'RecordTypePicklistValue' ]
  },

  RecordTypePicklistValue: {
    picklist : types.string,
    values   : 'PicklistValue'
  },

  RetrieveMessage: {
    fileName : types.string,
    problem  : types.string
  },

  RetrieveResult: {
    done            : types.bool,
    errorMessage    : types.string,
    errorStatusCode : types.string,
    fileProperties  : [ 'FileProperties' ],
    id              : types.string,
    messages        : [ 'RetrieveMessage' ],
    status          : types.string,
    success         : types.bool,
    zipFile         : types.string // could argue that this should be a buffer
  },

  RunTestFailure: {
    id         : types.string,
    message    : types.string,
    methodName : types.string,
    name       : types.string,
    namespace  : types.string,
    seeAllData : types.bool,
    stackTrace : types.string,
    time       : types.double,
    type       : types.string
  },

  RunTestResult: {
    codeCoverage         : [ 'CodeCoverageResult' ],
    codeCoverageWarnings : [ 'CodeCoverageWarning' ],
    failures             : [ 'RunTestFailure' ],
    numFailures          : types.integer,
    numTestsRun          : types.integer,
    successes            : [ 'RunTestSuccess' ],
    totalTime            : types.double
  },

  RunTestSuccess: {
    id         : types.string,
    methodName : types.string,
    name       : types.string,
    namespace  : types.string,
    seeAllData : types.bool,
    time       : types.double
  },

  SaveResult: {
    errors   : [ 'Error' ],
    fullName : types.string,
    success  : types.bool
  },

  SearchLayouts: {
    customTabListAdditionalFields      : [ types.string ],
    excludedStandardButtons            : [ types.string ],
    listViewButtons                    : [ types.string ],
    lookupDialogsAdditionalFields      : [ types.string ],
    lookupFilterFields                 : [ types.string ],
    lookupPhoneDialogsAdditionalFields : [ types.string ],
    searchFilterFields                 : [ types.string ],
    searchResultsAdditionalFields      : [ types.string ],
    searchResultsCustomButtons         : [ types.string ]
  },

  SharedTo: {
    allCustomerPortalUsers      : types.string,
    allInternalUsers            : types.string,
    allPartnerUsers             : types.string,
    group                       : [ types.string ],
    groups                      : [ types.string ],
    managerSubordinates         : [ types.string ],
    managers                    : [ types.string ],
    portalRole                  : [ types.string ],
    portalRoleandSubordinates   : [ types.string ],
    role                        : [ types.string ],
    roleAndSubordinates         : [ types.string ],
    roleAndSubordinatesInternal : [ types.string ],
    roles                       : [ types.string ],
    rolesAndSubordinates        : [ types.string ],
    territories                 : [ types.string ],
    territoriesAndSubordinates  : [ types.string ],
    territory                   : [ types.string ],
    territoryAndSubordinates    : [ types.string ],
    queue                       : [ types.string ]
  },

  SharingReason: {
    fullName : types.string,
    label    : types.string
  },

  SharingRecalculation: {
    className : types.string
  },

  ValidationRule: {
    active                : types.bool,
    description           : types.string,
    errorConditionFormula : types.string,
    errorDisplayField     : types.string,
    errorMessage          : types.string,
    fullName              : types.string
  },

  WebLink: {
    availability        : types.string,
    description         : types.string,
    displayType         : types.string,
    encodingKey         : types.string,
    fullName            : types.string,
    hasMenubar          : types.bool,
    hasScrollbars       : types.bool,
    hasToolbar          : types.bool,
    height              : types.integer,
    isResizable         : types.bool,
    linkType            : types.string,
    masterLabel         : types.string,
    openType            : types.string,
    page                : types.string,
    position            : types.string,
    protected           : types.bool,
    requireRowSelection : types.bool,
    scontrol            : types.string,
    showsLocation       : types.bool,
    showsStatus         : types.bool,
    url                 : types.string,
    width               : types.integer
  }

};
