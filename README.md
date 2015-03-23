nforce-metadata
===============

An [nforce](https://github.com/kevinohara80/nforce) plugin that facilitates working with the metadata api

## Installation

First, install nforce-metadata with npm

```bash
$ npm install nforce-metadata
```

Load the plugin

```js
var nforce = require('nforce');

// load the nforce-metadata plugin
require('nforce-metadata')(nforce);

var org = nforce.createConnection({
  clientId: '<client_id>',
  clientSecret: '<client_secret>',
  redirectUri: '<redirect_uri>',
  username: process.env.SFUSER,
  password: process.env.SFPASS,
  metaOpts: {       // options for nforce-metadata
    interval: 2000  // poll interval can be specified (optional)
  },
  plugins: ['meta'] // loads the plugin in this connection
});
```

## Usage

nforce-metadata allows you to make requests to the Salesforce 
Metadata API just as easily as you can make requests to the
REST API using the nforce base module.

The methods are all under the `meta` namespace in the 
connection object. Here is an example call.

```js
org.authenticate().then(function(){
  return org.meta.listMetadata({
    queries: [
      { type: 'CustomObject' },
      { type: 'CustomField' },
      { type: 'ApexClass' }
    ]
  });
}).then(function(meta) {
  _.each(meta, function(r) {
    console.log(r.type + ': ' + r.fullName + ' (' + r.fileName + ')');
  });
}).error(function(err) {
  console.error(err);
});
```

Just like nforce v1.0.0 and higher, you can either supply a
callback to the api methods or you can omit the callback
and use the returned Promise for async control flow.

See, callbacks work too...

```js
var md = [
  { 
    fullName: 'Test_Obj__c.Foo__c',
    label: 'Foo Bar',
    length: 100,
    type: 'Text'
  }
];

org.meta.createMetadata({ type: 'CustomField', metadata: md }, function(err, res) {
  if(err) return console.error(err);
  console.log(res);
});
```

## API

### meta.deploy(opts, [callback])

Deploy metadata to a Salesforce organization. 

[Salesforce Documentation]
(https://www.salesforce.com/us/developer/docs/api_meta/Content/meta_deploy.htm)

opts: 

* `oauth`: (Object:Optional) The oauth object. Required in multi-user mode.
* `zipFile`: (Buffer|Stream|String:Required) A zip file containing metadata for deployment.
This should be a Buffer, a Stream, or a base64 encoded String representing a zip file.
* `deployOptions`: (Object:Optional) Encapsulates options for determining which packages 
or files are deployed.
  * `allowMissingFiles`: (Boolean:Optional) Specifies whether a deploy succeeds even if 
files that are specified in package.xml but are not in the .zip file 
  * `autoUpdatePackage`: (Boolean:Optional) If a file is in the .zip file but not specified 
in package.xml, specifies whether the file should be automatically added to the package 
(true or not false). A retrieve() is automatically issued with the updated package.xml 
that includes the .zip file.
  * `checkOnly`: (Boolean:Optional) Indicates whether Apex classes and triggers are 
saved to the organization as part of the deployment (false) or not (true). Defaults 
to false. Any errors or messages that would have been issued are still generated. 
This parameter is similar to the Salesforce Ant tool’s checkOnly parameter.
  * `ignoreWarnings`: (Boolean:Optional) Indicates whether a warning should allow 
a deployment to complete successfully (true) or not (false). Defaults to false.
  * `performRetrieve`: (Boolean:Optional) Indicates whether a `retrieve()` call is 
performed immediately after the deployment (true) or not (false). Set to true in 
order to retrieve whatever was just deployed.
  * `purgeOnDelete`: (Boolean:Optional) If true, the deleted components in the 
destructiveChanges.xml manifest file aren't stored in the Recycle Bin. Instead, 
they become immediately eligible for deletion.
  * `rollbackOnError`: (Boolean:Optional) Indicates whether any failure causes a 
complete rollback (true) or not (false). If false, whatever set of actions can be performed 
without errors are performed, and errors are returned for the remaining actions. This 
parameter must be set to true if you are deploying to a production organization. 
The default is false.
  * `runAllTests`: (Boolean:Optional) If true, all Apex tests defined in the organization 
are run.
  * `runTests`: (String[]:Optional) A list of Apex tests to be run during deployment. 
Specify the class name, one name per instance.
  * `singlePackage`: (Boolean:Optional) Indicates whether the specified .zip file points 
to a directory structure with a single package (true) or a set of packages (false).

### meta.deployAndPoll(opts, [callback])

Performs a `deploy()` and also returns a poller that polls `checkDeployStatus()`.

opts: 

* `oauth`: (Object:Optional) The oauth object. Required in multi-user mode.
* `interval`: (Integer|Optional) The time in milliseconds to wait between polls. Defaults
to 2000 unless passed in as an option or defined in the connection as `metaOpts.interval`
* `zipFile`: (Buffer|Stream|String:Required) A zip file containing metadata for deployment.
This should be a Buffer, a Stream, or a base64 encoded String representing a zip file.
* `deployOptions`: (Object:Optional) Encapsulates options for determining which packages 
or files are deployed. See `deploy()` for all options.

poller events: 

* `start` Poller has started polling
* `poll` A poll has been executed. Callback contains the result.
* `cancel` Emitted when the poller has been cancelled
* `done` Emitted when the polling is completed

### meta.checkDeployStatus(opts, [callback])

Checks the status of declarative metadata call `deploy()`.

[Salesforce Documentation]
(https://www.salesforce.com/us/developer/docs/api_meta/Content/meta_checkdeploystatus.htm)

opts: 

* `oauth`: (Object:Optional) The oauth object. Required in multi-user mode.
* `id`: (String|Required) ID obtained from an AsyncResult object returned by `deploy()` 
or a subsequent `checkDeployStatus()` call
* `includeDetails`: (Boolean:Optional) Sets the DeployResult object to include 
DeployDetails information ((true) or not (false). The default is false. Available 
in API version 29.0 and later.

### meta.cancelDeploy(opts, [callback])

Cancels a deployment that hasn’t completed yet.

[Salesforce Documentation]
(https://www.salesforce.com/us/developer/docs/api_meta/Content/meta_canceldeploy.htm)

opts: 

* `oauth`: (Object:Optional) The oauth object. Required in multi-user mode.
* `id`: (String|Required) The ID of the deployment to cancel.

### meta.cancelDeployAndPoll(opts, [callback])

Performs a `cancelDeploy()` and also returns a poller that polls `checkDeployStatus()`.

opts: 

* `oauth`: (Object:Optional) The oauth object. Required in multi-user mode.
* `id`: (String|Required) The ID of the deployment to cancel.

### meta.retrieve(opts, [callback])

This call retrieves XML file representations of components in an organization.

[Salesforce Documentation]
(https://www.salesforce.com/us/developer/docs/api_meta/Content/meta_retrieve.htm)

opts:

* `oauth`: (Object:Optional) The oauth object. Required in multi-user mode.
* `apiVersion`: (Double:Optional) The API version for the retrieve request. This 
will default to the api version defined in the connection if not supplied.
* `packageNames`: (String[]:Optional) A list of package names to be retrieved. If 
you are retrieving only unpackaged components, do not specify a name here. You 
can retrieve packaged and unpackaged components in the same retrieve.
* `singlePackage`: (Boolean:Optional) Specifies whether only a single package is 
being retrieved (true) or not (false). If false, then more than one package is being 
retrieved.
* `specificFiles`: (String[]:Optional) A list of file names to be retrieved. If a 
value is specified for this property, packageNames must be set to null and singlePackage 
must be set to true.
* `unpackaged`: (Object:Optional) A list of components to retrieve that are not in a 
package. See the Salesforce documentation on [Package]
(https://www.salesforce.com/us/developer/docs/api_meta/Content/meta_package.htm#meta_package) 
for the valid object properties
to supply.

## meta.retrieveAndPoll(opts, [callback])

Performs a `retrieve()` and also returns a poller that polls `checkRetrieveStatus()`.

opts:

* `oauth`: (Object:Optional) The oauth object. Required in multi-user mode.
* `interval`: (Integer|Optional) The time in milliseconds to wait between polls. Defaults
to 2000 unless passed in as an option or defined in the connection as `metaOpts.interval`
* `apiVersion`: (Double:Optional) The API version for the retrieve request. This 
will default to the api version defined in the connection if not supplied.
* `packageNames`: (String[]:Optional) A list of package names to be retrieved. If 
you are retrieving only unpackaged components, do not specify a name here. You 
can retrieve packaged and unpackaged components in the same retrieve.
* `singlePackage`: (Boolean:Optional) Specifies whether only a single package is 
being retrieved (true) or not (false). If false, then more than one package is being 
retrieved.
* `specificFiles`: (String[]:Optional) A list of file names to be retrieved. If a 
value is specified for this property, packageNames must be set to null and singlePackage 
must be set to true.
* `unpackaged`: (Object:Optional) A list of components to retrieve that are not in a 
package. See the Salesforce documentation on [Package]
(https://www.salesforce.com/us/developer/docs/api_meta/Content/meta_package.htm#meta_package) 
for the valid object properties
to supply.

poller events: 

* `start` Poller has started polling
* `poll` A poll has been executed. Callback contains the result.
* `cancel` Emitted when the poller has been cancelled
* `done` Emitted when the polling is completed

### meta.checkRetrieveStatus(opts, [callback])

Checks the status of declarative metadata call `retrieve()` and returns the zip file contents.

[Salesforce Documentation]
(https://www.salesforce.com/us/developer/docs/api_meta/Content/meta_checkretrievestatus.htm)

opts: 

* `oauth`: (Object:Optional) The oauth object. Required in multi-user mode.
* `id`: (String|Required) ID obtained from a RetrieveResult object returned by a 
`retrieve()` call or a subsequent AsyncResult object returned by a checkStatus() call.
