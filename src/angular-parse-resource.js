(function(angular, Parse) { 'use strict';

  angular.module('angular-parse-resource', []);

  angular
    .module('angular-parse-resource')
    .provider('parseResource', function ParseResourceProvider() {
      var config = {}
        , isInitialised = false;

      this.setConfig = function(opts) {
        config.appId = opts.appId;
        config.appKey = opts.appKey;
      };

      this.initialise = function() {
        if(isInitialised) {
          return true;
        }
        console.log('parseResourceProvider - initialising');
        Parse.initialize(config.appId, config.appKey);
        isInitialised = true;
      };

      this.$get = ['$http', '$q', function($http, $q) {
        if(Parse === undefined) {
          console.error('Error, Parse SDK not loaded?');
        }
        this.initialise();

        var parseResourceFactory = function(resourceName) {
          console.log('parseResource - creating factory for', resourceName);
          var RawParseResource = Parse.Object.extend(resourceName);

          function ParseResource(value, rawParseInstance) {
            this.parseInstance = rawParseInstance || new RawParseResource(value);
            this.updateFromParseObject(this.parseInstance);
          }

          ParseResource.prototype.keysToIgnore = [
            'parseInstance', 'toObject', 'keysToIgnore', 'id',
            'updateFromParseObject'
          ];

          ParseResource.prototype.toObject = function() {
            var data = {};
            for(var key in this) {
              if(key.indexOf('$') !== -1) { continue; }
              if(ParseResource.prototype.keysToIgnore.indexOf(key) !== -1) { continue; }
              data[key] = this[key];
            }
            return data;
          };

          ParseResource.prototype.updateFromParseObject = function(parseObj) {
            console.log('ParseResource#updateFromParseObject - obj:', parseObj);
            this.id = parseObj.id;
            for(var key in parseObj.attributes) {
              this[key] = parseObj.attributes[key];
            }
          };

          ParseResource.prototype['$delete'] = function() {
            console.log('ParseResource#$save - deleting');
            var self = this;
            var deferred = $q.defer();
            this.parseInstance.destroy({
              success: function onDestroySuccess(obj) {
                delete this.id;
                deferred.resolve(this);
              },
              error: function(obj, error) {
                deferred.reject(error);
              }
            });
            return deferred.promise;
          };

          ParseResource.prototype['$save'] = function() {
            console.log('ParseResource#$save - saving');
            var self = this;
            var deferred = $q.defer();
            this.parseInstance.save(
              this.toObject(), {
                success: function onSaveSuccess(updatedInstance) {
                  console.log('ParseResource#$save - saved successfully');
                  self.updateFromParseObject(updatedInstance);
                  deferred.resolve(self);
                },
                error: function(parseInstance, error) {
                  console.log('ParseResource#$save - save failed :(', error);
                  deferred.reject(error);
                }
              });
            return deferred.promise;
          };

          ParseResource.instanceFromParseObject = function(parseObj) {
            return new ParseResource({}, parseObj);
          };

          var buildQuery = function(query) {
            return function(ParseResourceQuery) {
              var isExplicitQuery = false;
              for(var key in query) {
                if(ParseResourceQuery[key]) {
                  isExplicitQuery = true;
                  break;
                }
              }

              if(isExplicitQuery) {
                // Use keys from query as keys on ParseResourceQuery calling the function itself
              }
              else {
                for (var key in query) {
                  ParseResourceQuery.equalTo(key, query[key]);
                }
              }
            };
          };

          ParseResource.query = function(query) {
            console.log('ParseResource#query - Querying for ', query);
            var deferred = $q.defer();
            var ParseResourceQuery = new Parse.Query(RawParseResource);
            var queryBuilder = angular.isFunction(query) ? query : buildQuery(query);

            queryBuilder(ParseResourceQuery);

            ParseResourceQuery.find({
              success: function onFindSuccess(parseResults) {
                var results = [];
                angular.forEach(parseResults, function(parseResult) {
                  results.push(ParseResource.instanceFromParseObject(parseResult));
                });
                deferred.resolve(results);
              },
              error: function onFindError(error) {
                deferred.reject(error);
              }
            });
            return deferred.promise;
          };

          ParseResource.get = function(objectId) {
            var deferred = $q.defer();
            var ParseResourceQuery = new Parse.Query(RawParseResource);
            ParseResourceQuery.get(objectId, {
              success: function onQuerySuccess(parseInstance) {
                deferred.resolve(ParseResource.instanceFromParseObject(parseInstance));
              },
              error: function onQueryError(object, error) {
                console.error('ParseResource.getById - error.', error);
                deferred.reject(error);
              }
            });

            return deferred.promise;
          };
          return ParseResource;
        };

        return parseResourceFactory;
      }];
    });
  ;

})(angular, Parse);