/**
 * In unit tests we don't include the Parse SDK _but_ it must be defined for the module to be loaded, so we
 * stub it out here in a faked object.
 *
 * @type {{}}
 */
Parse = {};
Parse.setup = function() {
  var FakeParseObject = function (vals) {
    this.attributes = angular.extend({}, vals);
    return this;
  };

  Parse.initialize = jasmine.createSpy();

  Parse.Object = {
    extend: jasmine.createSpy().and.returnValue(FakeParseObject)
  };

  Parse.Query = function (parseResource) {
    var createFakeObject = function (props, objectId) {
      var response = new FakeParseObject(props);
      response.id = objectId;
      return response;
    };
    var searchCalls = [];
    var queryInstance = {
      find: function (callbacks) {

      },
      get: function (objectId, callbacks) {
        if (objectId === 'pass') {
          callbacks.success(createFakeObject(Parse.Query.responseObject || {}, objectId));
        }
        else if (objectId === 'fail') {
          callbacks.error({error: 'an error occurred'})
        }
      }
    };

    var supportedQueryFunctions = ['equalTo'];
    angular.forEach(supportedQueryFunctions, function (functionName) {
      queryInstance[functionName] = function () {
        searchCalls.push({name: functionName, args: arguments});
      };
    });

    return queryInstance;
  };
}