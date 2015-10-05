'use strict';

describe('Controller: SystemMessagesCtrl', function () {

  // load the controller's module
  beforeEach(module('emmaDashboardApp'));

  var SystemMessagesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SystemMessagesCtrl = $controller('SystemMessagesCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SystemMessagesCtrl.awesomeThings.length).toBe(3);
  });
});
