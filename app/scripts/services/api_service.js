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
      }
    });

    // Public API here
    return {
      participants: resourceInstance.participants,
      activityStream: resourceInstance.activity_stream,
      overview: resourceInstance.overview
    };
  });
