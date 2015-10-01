'use strict';

/**
 * @ngdoc function
 * @name emmaDashboardApp.controller:CourseCtrl
 * @description
 * # CourseCtrl
 * Controller of the emmaDashboardApp
 */
angular.module('emmaDashboardApp')
  .controller('CourseCtrl', function ($scope, $window, $routeParams, apiService) {
    var w = angular.element($window);
    var loadedTabs = [];

    // Hard coded default course id
    var courseId = $routeParams.id;

    $scope.participantsConfig = {
      options: {
        chart: {
          type: 'column'
        },
        tooltip: {
          shared: true
        },
        plotOptions: {
          column: {
            pointPadding: 0.2,
            borderWidth: 0
          }
        },
        yAxis: {
          min: 0,
          title: {
            text : 'Enroll/Unenroll'
          }
        }
      },
      title: {
        text: 'Enrollment History'
      },
      subtitle: {
        text: ''
      },
      loading: true,
      xAxis: {
        categories: [],
        crosshair: true
      },
      series: []
    };

    $scope.overviewConfig = {
      options: {
        chart: {
          zooomType: 'xy'
        },
        tooltip: {
          shared: true
        },
        legend: {
            layout: 'vertical',
            align: 'left',
            x: 120,
            verticalAlign: 'top',
            y: 100,
            floating: true,
            backgroundColor: (window.Highcharts.theme && window.Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
        }
      },
      title: {
        text: 'General Statistics'
      },
      subtitle: {
        text: ''
      },
      loading: true,
      xAxis: [{
        categories: [],
        crosshair: true
      }],
      yAxis: [{
        labels: {
          style: {
            color: window.Highcharts.getOptions().colors[0]
          }
        },
        title: {
          text: 'Number of interactions',
          style: {
            color: window.Highcharts.getOptions().colors[0]
          }
        }
      }, {
        title: {
          text: 'Average time spent',
          style: {
            color: window.Highcharts.getOptions().colors[1]
          }
        },
        labels: {
          format: '{value} minutes',
          style: {
            color: window.Highcharts.getOptions().colors[1]
          }
        },
        opposite: true
      }],
      series: [{
        name: 'Number of interactions',
        type: 'column',
        data: [10, 20, 30, 40, 50, 60, 50, 40, 30]
      } , {
        name: 'Average time spent',
        type: 'spline',
        data: [5, 8, 11, 14, 17, 20, 17, 14, 11],
        yAxis: 1,
        tooltip: {
          valueSuffix: 'minutes'
        }
      }]
    };

    $scope.loadParticipants = function () {
      if ( loadedTabs.indexOf('participants') !== -1 ) {
        return;
      }

      loadedTabs.push('participants');

      apiService.participants({
        id: courseId
      }, function (data) {
        $scope.participantsConfig.subtitle.text = data.title;
        $scope.participantsConfig.xAxis.categories = data.dates;
        $scope.participantsConfig.series.push({
          name: 'Enroll',
          data: data.join
        });
        $scope.participantsConfig.series.push({
          name: 'Unenroll',
          data: data.leave
        });
        $scope.enrolledStudents = [];
        $scope.unenrolledStudents = [];
        angular.forEach(data.students, function (student) {
          if ( student.join > student.leave ) {
            $scope.enrolledStudents.push(student);
          } else {
            $scope.unenrolledStudents.push(student);
          }
        });
        $scope.participantsConfig.loading = false;
        // Resize is required
        w.resize();
      });
    };

    $scope.loadActivityStream = function () {
      if ( loadedTabs.indexOf('activity_stream') !== -1 ) {
        return;
      }

      loadedTabs.push('activity_stream');

      apiService.activityStream({
        id: courseId
      }, function (data) {
        $scope.activityData = data.data;
      });
    };

    $scope.loadOverview = function () {
      if ( loadedTabs.indexOf('overview') !== -1 ) {
        return;
      }

      loadedTabs.push('overview');

      apiService.overview({
        id: courseId
      }, function (data) {
        $scope.overviewConfig.subtitle.text = data.title;
        $scope.overviewConfig.xAxis[0].categories = data.lessons;
        $scope.overviewConfig.series[0].data = data.interactions;
        $scope.overviewConfig.series[1].data = data.time_spent;
        $scope.overviewConfig.loading = false;
        $scope.overviewResources = data.resources;
        // Resize is required
        w.resize();
      });
    };

    $scope.loadLessons = function () {
      if ( loadedTabs.indexOf('lessons') !== -1 ) {
        return;
      }

      loadedTabs.push('lessons');

      apiService.lessons({
        id: courseId
      }, function(data) {
        $scope.lessonsWithUnits = data.lessons_with_units;
      });
    };
  });
