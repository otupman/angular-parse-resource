describe("Midway: Testing Modules", function() {
  describe("App Module:", function () {
    var module;
    before(function () {
      module = angular.module("angular-parse-resource");
    });
    it("should be registered", function () {
      expect(module).not.to.equal(null);
    });

  });
});