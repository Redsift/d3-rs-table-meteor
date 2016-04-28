# d3-rs-table-meteor

This repository shows how to use an ES2016 module ((d3-rs-table)[https://github.com/redsift/d3-rs-table-meteor.git]) with Meteor 1.3+. The module is not transpiled to ES5 code before. In this example `./client/main.js` imports the entry point of the ES2016 module from `./imports/d3-rs-table/index.js`.

## Installation

```shell
> git clone --recursive https://github.com/redsift/d3-rs-table-meteor.git
> cd d3-rs-table-meteor && npm install
> (cd ./imports/d3-rs-table && npm install)
> meteor
```

## CAUTION

It is **NOT** possible to install or copy the ES2016 module to `node_modules` and import `./node_modules/d3-rs-table/index.js` into Meteor land! This is due to a limitation in Meteor regarding the import of modules other than CommonJS modules from the folder `npm_modules`. There is a issue on that here:  [[1.3-modules-beta.2] How do we transform files in node_modules? #5892](https://github.com/meteor/meteor/issues/5892)

You either have to install the ES5 transpiled version of the module or copy the module somewhere outside the `node_modules` directory.
