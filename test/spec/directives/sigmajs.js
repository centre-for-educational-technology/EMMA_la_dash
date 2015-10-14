'use strict';

describe('Directive: sigmajs', function () {

  // load the directive's module
  beforeEach(module('emmaDashboardApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<sigmajs></sigmajs>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the sigmajs directive');
  }));
});
