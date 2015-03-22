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

### deploy(opts, [callback])

Deploy metadata to a Salesforce organization

opts: 

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
