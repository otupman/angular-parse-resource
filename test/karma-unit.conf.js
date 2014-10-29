// Borrowed from the Year of Moo tutorial https://github.com/yearofmoo-articles/AngularJS-Testing-Article/
var sharedConfig = require('./karma-shared.conf');
module.exports = function (config) {
  var conf = sharedConfig();
  conf.files = conf.files.concat([
    'bower_components/angular-mocks/angular-mocks.js',
    'node_modules/mock-promises/lib/mock-promises.js',
    'test/lib/parse-sdk-stub.js',
    'src/angular-parse-resource.js',
    './test/unit/**/*.js'
  ]);
  config.set(conf);
};