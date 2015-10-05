'use strict';

/**
 * @ngdoc service
 * @name emmaDashboardApp.systemMessagesService
 * @description
 * # systemMessages
 * Factory in the emmaDashboardApp.
 */
angular.module('emmaDashboardApp')
  .factory('systemMessagesService', function () {
    var messages = [];
    var dismissTimeout = 10000;

    // Success, info, warning, danger
    return {
      addMessage: function (type, message) {
        messages.push({
          type: type,
          message: message
        });
      },
      addSuccess: function (message) {
        this.addMessage('success', message);
      },
      addInfo: function (message) {
        this.addMessage('info', message);
      },
      addWarning: function (message) {
        this.addMessage('warning', message);
      },
      addDanger: function (message) {
        this.addMessage('danger', message);
      },
      getMessages: function () {
        return messages;
      },
      removeMessage: function(index) {
        messages.splice(index, 1);
      },
      getDismissTimeout: function () {
        return dismissTimeout;
      }
    };
  });
