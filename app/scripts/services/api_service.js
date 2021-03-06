'use strict';

/**
 * @ngdoc service
 * @name emmaDashboardApp.apiService
 * @description
 * # apiService
 * Factory in the emmaDashboardApp.
 */
angular.module('emmaDashboardApp')
  .factory('apiService', function ($resource, apiLocation) {
    var apiUrl = 'api/course/';
    if ( apiLocation ) {
      apiUrl = apiLocation + 'course/';
    }

    var resourceInstance = $resource(apiUrl, {}, {
      participants: {
        url: apiUrl + ':id/participants',
        method: 'GET',
        isArray: false,
        transformResponse: [angular.fromJson, function(data, headersGetter, status) {
          return ( status === 500 ) ? data : data;
        }]
      },
      activity_stream: {
        url: apiUrl + ':id/activity_stream',
        method: 'GET',
        isArray: false,
        transformResponse: [angular.fromJson, function(data, headersGetter, status) {
          return ( status === 500 ) ? data : data;
        }]
      },
      overview: {
        url: apiUrl + ':id/overview',
        method: 'GET',
        isArray: false,
        transformResponse: [angular.fromJson, function(data, headersGetter, status) {
          return ( status === 500 ) ? data : data;
        }]
      },
      lessons: {
        url: apiUrl + ':id/lessons',
        method: 'GET',
        isArray: false,
        transformResponse: [angular.fromJson, function(data, headersGetter, status) {
          return ( status === 500 ) ? data : data;
        }]
      },
      course_lesson_unit: {
        url: apiUrl + ':course/lesson/:lesson/unit/:unit',
        method: 'GET',
        isArray: false,
        transformResponse: [angular.fromJson, function(data, headersGetter, status) {
          return ( status === 500 ) ? data : data;
        }]
      },
      sna: {
        url: apiUrl + ':id/sna',
        method: 'GET',
        isArray: false,
        transformResponse: [angular.fromJson, function(data, headersGetter, status) {
          return ( status === 500 ) ? data : data;
        }]
      },
      student_overview: {
        url: apiUrl + ':id/student/:mbox',
        method: 'GET',
        isArray: false,
        transformResponse: [angular.fromJson, function(data, headersGetter, status) {
          return ( status === 500 ) ? data : data;
        }]
      }
    });

    // Public API here
    return {
      participants: resourceInstance.participants,
      activityStream: resourceInstance.activity_stream,
      overview: resourceInstance.overview,
      lessons: resourceInstance.lessons,
      course_lesson_unit: resourceInstance.course_lesson_unit,
      sna: resourceInstance.sna,
      student_overview: resourceInstance.student_overview
    };
  });
