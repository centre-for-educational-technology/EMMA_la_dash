'use strict';

/**
 * @ngdoc function
 * @name emmaDashboardApp.controller:CourseCtrl
 * @description
 * # CourseCtrl
 * Controller of the emmaDashboardApp
 */
angular.module('emmaDashboardApp')
  .controller('CourseCtrl', function ($scope, $window, $routeParams, apiService, systemMessagesService) {
    var w = angular.element($window);
    var loadedTabs = [];

    // Hard coded default course id
    var courseId = $routeParams.id;

    function handleErrorMessage (response) {
      var message = response.data.message ? response.data.message : response.statusText;

      systemMessagesService.addDanger('Error: Serice responded with code ' + response.code + ' and message ' + message);
    }

    function pretendResize () {
      w.resize();
    }

    $scope.learningContentConfig = {
      options: {
        chart: {
          type: 'column'
        },
        title: {
          text: 'Learning Content'
        },
        yAxis: {
          min: 0,
          max: 100,
          title: {
            text: '% of enrolled users'
          }
        },
        xAxis: {
          labels: {
            enabled: false
          }
        },
        tooltip: {
          'headerFormat': '',
          'pointFormat': '<span>{point.count} enrolled users ({point.y:.2f})% have <span style="color:{point.color};text-transform:lowercase;font-weight:bold;">{series.name}</span> in current unit</span>'
        }
      },
      loading: true,
      series: []
    };

    $scope.assignmentsConfig = {
      options: {
        chart: {
          type: 'column'
        },
        yAxis: {
          min: 0,
          max: 100,
          title: {
            text: '% of enrolled users'
          }
        },
        xAxis: {
          labels: {
            enabled: false
          }
        },
        tooltip: {
          formatter: function () {
            var text = '';
            if ( this.series.name === 'Viewed assignments' ) {
              text += '<span>' + this.point.count + ' enrolled users (' + this.y.toFixed(2) + ')% have <span style="color:'+ this.color + ';text-transform:lowercase;font-weight:bold;">' + this.series.name + '</span> in current unit</span>';
            } else {
              text += '<span>Submitted assignments: ' + this.point.submitted_assignments + ' by ' + this.point.unique_users + ' unique users.</span><br>';
              text += '<span>Average score: ' + this.point.average_score.toFixed(2) + '%</span>';
            }

            return text;
          }
        }
      },
      title: {
        text: ''
      },
      loading: true,
      series: []
    };

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
        pretendResize();
      }, function (response) {
        handleErrorMessage(response);
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
      }, function (response) {
        handleErrorMessage(response);
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
        pretendResize();
      }, function (response) {
        handleErrorMessage(response);
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
        $scope.unitAjaxInProgress = false;
        setTimeout(function () {
          $scope.allowLoadingUnitInfo = true;
          if ( $scope.lessonsWithUnits[0].units.length > 0 ) {
            $scope.loadCourseLessonUnit($scope.lessonsWithUnits[0].id, $scope.lessonsWithUnits[0].units[0].id);
          }
        }, 1000);
      }, function (response) {
        handleErrorMessage(response);
      });
    };

    $scope.selectLessonTab = function (index) {
      if ($scope.allowLoadingUnitInfo !== true ) {
        return;
      }

      $scope.learningContentConfig.loading = true;
      $scope.assignmentsConfig.loading = true;

      $scope.unitResources = null;

      if ( $scope.lessonsWithUnits[index].units.length > 0 ) {
        if ( $scope.lessonsWithUnits[index].units[0].active === true ) {
          $scope.loadCourseLessonUnit($scope.lessonsWithUnits[index].id, $scope.lessonsWithUnits[index].units[0].id);
        } else {
          $scope.lessonsWithUnits[index].units[0].active = true;
        }
      }
    };

    $scope.loadCourseLessonUnit = function (lessonId, unitId) {
      if ( $scope.allowLoadingUnitInfo !== true ) {
        return;
      }

      $scope.unitAjaxInProgress = true;

      $scope.learningContentConfig.loading = true;
      $scope.assignmentsConfig.loading = true;

      $scope.unitResources = null;

      apiService.course_lesson_unit({
        course: courseId,
        lesson: lessonId,
        unit: unitId
      }, function (data) {
        $scope.learningContentConfig.series = [{
          name: 'Accessed unit',
          color: window.Highcharts.getOptions().colors[0],
          data: [{
            y: data.learning_content.unit.count / data.students_count * 100,
            count: data.learning_content.unit.count
          }]
        }, {
          name: 'Accessed study materials',
          color: window.Highcharts.getOptions().colors[1],
          data: [{
            y: data.learning_content.materials.count / data.students_count * 100,
            count: data.learning_content.materials.count
          }],
        }, {
          name: 'Accessed hyperlinks',
          color: window.Highcharts.getOptions().colors[2],
          data: [{
            y: data.learning_content.hyperlinks.count / data.students_count * 100,
            count: data.learning_content.hyperlinks.count
          }]
        }];
        $scope.learningContentConfig.loading = false;

        $scope.assignmentsConfig.series = [{
          name: 'Viewed assignments',
          color: window.Highcharts.getOptions().colors[0],
          data: [{
            y: data.learning_content.viewed_assignments.count / data.students_count * 100,
            count: data.learning_content.viewed_assignments.count
          }]
        }, {
          name: 'Submitted assignments',
          color: window.Highcharts.getOptions().colors[1],
          data: [{
            y: data.learning_content.submitted_assignments.unique_users / data.students_count * 100,
            unique_users: data.learning_content.submitted_assignments.unique_users,
            submitted_assignments: data.learning_content.submitted_assignments.count,
            average_score: data.learning_content.submitted_assignments.average_score * 100
          }]
        }];
        $scope.assignmentsConfig.title.text = 'Assignments (' + data.assignments_count + ')';
        $scope.assignmentsConfig.loading = false;

        $scope.unitAjaxInProgress = false;

        $scope.unitResources = data.resources;
      }, function (response) {
        handleErrorMessage(response);
        $scope.unitAjaxInProgress = false;
      });
    };
  });
