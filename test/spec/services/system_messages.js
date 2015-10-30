'use strict';

describe('Service: systemMessagesService', function () {

  // load the service's module
  beforeEach(module('emmaDashboardApp'));

  // instantiate service
  var systemMessagesService;
  beforeEach(inject(function (_systemMessagesService_) {
    systemMessagesService = _systemMessagesService_;
  }));

  it('should do something', function () {
    expect(!!systemMessagesService).toBe(true);
  });

});
