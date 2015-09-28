'use strict';

describe('Service: apiLocation', function () {

  // load the service's module
  beforeEach(module('emmaDashboardApp'));

  // instantiate service
  var apiLocation;
  beforeEach(inject(function (_apiLocation_) {
    apiLocation = _apiLocation_;
  }));

  it('should do something', function () {
    expect(!!apiLocation).toBe(true);
  });

});
