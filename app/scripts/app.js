'use strict';

/**
 * @ngdoc overview
 * @name emmaDashboardApp
 * @description
 * # emmaDashboardApp
 *
 * Main module of the application.
 */
angular
  .module('emmaDashboardApp', [
    'ngAnimate',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ui.bootstrap',
    'highcharts-ng'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/course/:id', {
        templateUrl: 'views/course.html',
        controller: 'CourseCtrl',
        controllerAs: 'course'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
