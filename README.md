# angular-parse-resource
Giving parse.com some $resource-esque semantics

# Quick info

Add `angular-parse-resource` as a dependency.

    var myApp =  angular.module('demoApp', ['angular-parse-resource']);


Configure the provider with your Parse.com app ID & app key

    myApp.config(function(parseResourceProvider) {
      parseResourceProvider.setConfig({ appId: 'AppId', appKey: 'AppKey' })
    });
    
    
In your application code, you can reference a particular Parse.com model like so:

    function MyController(function($scope, parseResource) {
      var Person = parseResource('Person');
      $scope.newPerson = function() {
        var newPerson = new Person();
        newPerson.firstName = 'Fred';
        newPerson.familyName = 'Flintstone';
        newPerson.save().then(function onSuccess(savedPerson) {
          alert('Person saved!');
        }, function onFailure(error) {
          alert(error);
        });
      };
      
      
      $scope.getPerson = function(personId) {
        return Person.get(personId); // 
      }
    });

If you have a raw Parse object you can shove it into angular-parse-resource like so:

    function OtherController(function($scope, parseResource, rawParseObject) {
      var Person = parseResource('Person');
      
      var somePerson = new Person();
      somePerson.updateFromParseObject(rawParseObject);
    });
