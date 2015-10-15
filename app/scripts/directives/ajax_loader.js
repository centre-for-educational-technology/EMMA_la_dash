'use strict';

/**
 * @ngdoc directive
 * @name emmaDashboardApp.directive:ajaxLoader
 * @description
 * # ajaxLoader
 */
angular.module('emmaDashboardApp')
  .directive('ajaxLoader', function () {
    return {
      templateUrl: 'views/ajax_loader.html',
      restrict: 'E',
      scope: {
        ajaxLoading: '='
      }
    };
  });
