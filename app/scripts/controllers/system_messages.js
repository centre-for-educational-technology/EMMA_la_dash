'use strict';

/**
 * @ngdoc function
 * @name emmaDashboardApp.controller:SystemMessagesCtrl
 * @description
 * # SystemMessagesCtrl
 * Controller of the emmaDashboardApp
 */
angular.module('emmaDashboardApp')
  .controller('SystemMessagesCtrl', function ($scope, systemMessagesService) {
    $scope.dismissTimeout = systemMessagesService.getDismissTimeout();

    $scope.getMessages = function () {
      return systemMessagesService.getMessages();
    };

    $scope.closeMessage = function (index) {
      return systemMessagesService.removeMessage(index);
    };
  });
