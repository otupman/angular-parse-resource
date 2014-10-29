//
// test/unit/servicesSpec.js
//
describe("Unit: Testing Service(s)", function() { 'use strict';
  var theParseResourceProvider;

  beforeEach(function() {
    var fakeModule = angular.module('angular-parse-resource.fake.module', function() {});
    fakeModule.config(function(parseResourceProvider) {
      theParseResourceProvider = parseResourceProvider;
    });
    module('angular-parse-resource', 'angular-parse-resource.fake.module');
    inject(function() {});
  });

  beforeEach(Parse.setup);

  function setParserResourceConfig() {
    return theParseResourceProvider.setConfig({ appId: 'AppId', appKey: 'AppKey' });
  }

  function fakeParseInstance(testKeys, objectId) {
    var TestResourceParseClass = Parse.Object.extend('TestResource');
    var testResourceParseInstance = new TestResourceParseClass(testKeys || {});
    testResourceParseInstance.id = objectId || 123;
    return testResourceParseInstance;
  }

  function TestResourceClass(parseResource) {
    return parseResource('TestResource');
  }

  describe('angular-parse-resource', function() {

    describe('angularResource', function() {
      beforeEach(function() {
        setParserResourceConfig();
      });

      describe('ParseResource instance', function() {
        var parseResource, TestResource, $rootScope
          , parseInstance, testInstance
          , testKeys = {key1: 'val1', key2: 'val2'};

        beforeEach(inject(function(_parseResource_, _$rootScope_) {
          parseResource = _parseResource_;
          TestResource = new parseResource('TestResource');
          $rootScope = _$rootScope_;

          parseInstance = fakeParseInstance(testKeys, '1234');
          testInstance = new TestResource();
        }));

        describe('#updateFromParseObject', function() {
          beforeEach(function() {
            testInstance.updateFromParseObject(parseInstance);
          });

          it('sets the ID', function(){
            expect(testInstance.id).toEqual(parseInstance.id);
          });
          it('sets all the attributes', function() {
            expect(testInstance).toEqual(jasmine.objectContaining(testKeys));
          });
        });

        xdescribe('#toObject', function() {
          it('ignores all special ($) functions', function() {
            testInstance.updateFromParseObject(parseInstance);
            expect(testInstance.toObject()['$delete']).toBeUndefined();
          });
          it('ignores all keys to ignore', function() {});
          it('returns all object properties for parse.com', function() {});
        });

        xdescribe('#$delete', function() {

        });

        xdescribe('#$save', function() {
          it('correctly calls parse', function() {});
          it('updates the ParseResource with the parse.com response', function() {});

        });
      });

      describe('#query', function() {
        var successCallback, errorCallback
          , parseResource, $rootScope;

        beforeEach(inject(function(_parseResource_, _$rootScope_) {
          parseResource = _parseResource_;
          $rootScope = _$rootScope_;
        }));

        function callQuery(objectId) {
          Parse.Query.responseObject = {key1: 'val1'};
          successCallback = jasmine.createSpy('successCallback');
          errorCallback = jasmine.createSpy('errorCallback');
          TestResourceClass(parseResource)
            .get(objectId)
            .then(successCallback, errorCallback);
          $rootScope.$digest();
          return {
            success: successCallback, error: errorCallback
          };
        }

        xdescribe('simple equalTo query', function() {
          var simpleQuery = {key1: 'val1'};
          it('returns two results', function() {});
          it('calls equalTo once', function() {});
          it('returns correcty wrapped parse objects', function() {});
        });

        xdescribe('passing query builder function', function() {
          it('calls the query build function', function() {});
          it('does not call equalTo at all', function() {});
        });

        xdescribe('with a complex query object', function() {
          it('does not call equalTo at all', function() {});
          it('calls the appropriate Query functions', function() {});
        });
      });

      describe('#get', function() {
        var successCallback, errorCallback
          , parseResource, $rootScope;

        beforeEach(inject(function(_parseResource_, _$rootScope_) {
          parseResource = _parseResource_;
          $rootScope = _$rootScope_;
        }));

        function callGet(objectId) {
          Parse.Query.responseObject = {key1: 'val1'};
          successCallback = jasmine.createSpy('successCallback');
          errorCallback = jasmine.createSpy('errorCallback');
          TestResourceClass(parseResource)
            .get(objectId)
            .then(successCallback, errorCallback);
          $rootScope.$digest();
          return {
            success: successCallback, error: errorCallback
          };
        }

        describe('with a correct object ID', function() {
          beforeEach(function() { callGet('pass'); })

          it('succeeds', function() {
            expect(successCallback).toHaveBeenCalled();
          });

          it('includes the attributes', function() {
            expect(successCallback)
              .toHaveBeenCalledWith(jasmine.objectContaining(Parse.Query.responseObject));
          });

          it('includes the object ID', function() {
            expect(successCallback)
              .toHaveBeenCalledWith(jasmine.objectContaining({id: 'pass'}))
          });
        });

        describe('with an invalid object ID', function() {
          it('fails', inject(function(parseResource, $rootScope) {
            callGet('fail');

            expect(successCallback.calls.count()).toEqual(0);
            expect(errorCallback).toHaveBeenCalled();
          }));
        });
      });

      describe('#instanceFromParseObject', function() {
        it('initialises from an existing parse object', inject(function(parseResource) {
          var parseInstance = fakeParseInstance();
          var TestResource = parseResource('TestResource');
          expect(TestResource.instanceFromParseObject(parseInstance)).not.toBeUndefined();
          expect(TestResource.instanceFromParseObject(parseInstance).objectId).toEqual(parseInstance.objectId);
        }));
      });

      describe('parseResourceFactory', function() {
        describe('.constructor', function() {
          var testKeys = {key1: 'val1', key2: 'val2'}
            , parseResource;

          beforeEach(inject(function(_parseResource_) {
            parseResource = _parseResource_;
          }));

          it('initialises from an object', function() {

            var TestResource = parseResource('TestResource');
            var resourceInstance = new TestResource(testKeys);
            expect(resourceInstance).toEqual(jasmine.objectContaining(testKeys));
            expect(resourceInstance.objectId).toBeUndefined();
          });

          it('initialises from an existing Parse object', function() {
            var testResourceParseInstance = fakeParseInstance(testKeys);

            var TestResource = parseResource('TestResource');
            var resourceInstance = new TestResource(undefined, testResourceParseInstance);
            expect(resourceInstance).toEqual(jasmine.objectContaining(testKeys));
            expect(resourceInstance.objectId).toEqual(testResourceParseInstance.objectId);
          });
        });
      });

    });

    describe('angularResourceProvider', function() {


      describe('#config', function() {
        it('should set the config options correctly', function() {
          var configToSet = {appId: 'AppId', appKey: 'AppKey'};
          var updatedConfig = theParseResourceProvider.setConfig(configToSet);
          expect(updatedConfig.appId).toEqual(configToSet.appId);
          expect(updatedConfig.appKey).toEqual(configToSet.appKey);
        });
      });

      describe('#get', function() {
        beforeEach(function() {
          setParserResourceConfig();
        });

        it('declares the correct dependencies', function() {
          expect(theParseResourceProvider.$get[0]).toEqual('$http');
          expect(theParseResourceProvider.$get[1]).toEqual('$q');
        });
      });

      describe('#initialise', function() {
        it('should throw an error if no config is set', function() {
          function callWithNoConfig() {
            theParseResourceProvider.initialise();
          }
          expect(callWithNoConfig).toThrow();
        });

        describe('with a config set', function() {
          var config;

          beforeEach(function() {
            config = setParserResourceConfig();
          });

          it('should call the parse initialise with the config params', function() {
            theParseResourceProvider.initialise();
            expect(Parse.initialize).toHaveBeenCalledWith(config.appId, config.appKey);
          });

          it('should not call parse initialise twice', function() {
            theParseResourceProvider.initialise();
            theParseResourceProvider.initialise();
            expect(Parse.initialize.calls.count()).toEqual(1);
          });
        });
      });
    });

  });

});