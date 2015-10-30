'use strict';

describe('Service: dashboardType', function () {

  // load the service's module
  beforeEach(module('emmaDashboardApp'));

  // instantiate service
  var dashboardType;
  beforeEach(inject(function (_dashboardType_) {
    dashboardType = _dashboardType_;
  }));

  it('should do something', function () {
    expect(!!dashboardType).toBe(true);
  });

});
