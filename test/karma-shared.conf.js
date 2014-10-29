// Borrowed from the Year of Moo tutorial https://github.com/yearofmoo-articles/AngularJS-Testing-Article/
module.exports = function() {
  return {
    basePath: '../',
    frameworks: ['jasmine'],
    reporters: ['progress'],
    browsers: ['Chrome'],
    autoWatch: true,
    singleRun: false,
    colors: true,
    files : [
      'bower_components/angular/angular.js',
      'node_modules/karma-jasmine/lib/jasmine.js' //TODO(otupman): pretty sure we shouldn't have to do this, but hack..
    ]
  }
};