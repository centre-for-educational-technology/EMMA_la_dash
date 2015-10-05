'use strict';

describe('Service: systemMessages', function () {

  // load the service's module
  beforeEach(module('emmaDashboardApp'));

  // instantiate service
  var systemMessages;
  beforeEach(inject(function (_systemMessages_) {
    systemMessages = _systemMessages_;
  }));

  it('should do something', function () {
    expect(!!systemMessages).toBe(true);
  });

});
