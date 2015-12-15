'use strict';

/**
 * @ngdoc function
 * @name emmaDashboardApp.controller:CourseCtrl
 * @description
 * # CourseCtrl
 * Controller of the emmaDashboardApp
 */
angular.module('emmaDashboardApp')
  .controller('CourseCtrl', function ($scope, $window, $routeParams, apiService, systemMessagesService, dashboardType) {
    //Colours
    var color_emma_green = '#00aa9d';
    var color_emma_pink = '#c464ac';
    var color_emma_grey = '#c6c6c6';
    var color_emma_light_grey = '#E7E7E7';

    var w = angular.element($window);
    var loadedTabs = [];

    var courseId = $routeParams.id;
    var mbox = $routeParams.mbox;

    function handleErrorMessage (response) {
      var message = response.data.message ? response.data.message : response.statusText;

      systemMessagesService.addDanger('Error: Serice responded with code ' + response.code + ' and message ' + message);
    }

    function pretendResize () {
      w.resize();
    }

    function emulatePostponedResize () {
      setTimeout(function () {
        window.dispatchEvent(new Event('resize'));
      }, 100);
    }

    $scope.snaData = {
      nodes: [],
      edges: [],
      loading: true
    };

    $scope.learningContentConfig = {

      options: {
        chart: {
          type: 'column'
        },
        title: {
          text: 'Learning Content',
          align: 'left',
          margin: 25,
          style: {
            color: color_emma_green

          }
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
        text: 'Enrollment History',
        align: 'left',
        margin: 25,
        style: {
          color: color_emma_green
        }
      },
      subtitle: {
        text: '',
        align: 'left',
        margin: 70,
        lineHeight: 1.1,
        style: {
          color: '#000000'
        }
      },
      loading: true,
      xAxis: {
        categories: [],
        crosshair: {
          color: color_emma_light_grey // color
        }
      },
      series: []
    };

    window.Highcharts.setOptions({
      colors: [color_emma_green, color_emma_pink, color_emma_grey, '#000000']
    });

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
        text: 'General Statistics',
        align: 'left',
        margin: 25,
        style: {
          color: color_emma_green

        }
      },
      subtitle: {
        text: '',
        align: 'left',
        margin: 70,
        style: {
          color: '#000000'
        }
      },

      loading: true,
      xAxis: [{
        categories: [],
        crosshair: {
          color: color_emma_light_grey // color
        }
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
        data: []
      } , {
        name: 'Average time spent',
        type: 'spline',
        data: [],
        yAxis: 1,
        tooltip: {
          valueSuffix: 'minutes'
        }
      }]
    };

    $scope.loadParticipants = function () {
      if ( loadedTabs.indexOf('participants') !== -1 ) {
        emulatePostponedResize();
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
        emulatePostponedResize();
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
        emulatePostponedResize();
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

    //Student progress overview tab
    $scope.loadStudentOverview = function () {
      if ( loadedTabs.indexOf('student_overview') !== -1 ) {
        emulatePostponedResize();
        return;
      }

      loadedTabs.push('student_overview');
      $scope.unitAjaxInProgress = true;
      $scope.lessons = [];
      $scope.lessons.units = [];

      apiService.student_overview({
        id: courseId,
        mbox: mbox
      }, function (data) {
        $scope.title = data.course_title;
        $scope.course_start_date = data.course_start_date;
        $scope.course_end_date = data.course_end_date;
        $scope.lessons = data.learning_content.materials.lessons_with_units;


        $scope.all_units = data.learning_content.materials.all_units;
        $scope.units_visited = data.learning_content.materials.units_visited;

        $scope.assignments = data.assignments;
        $scope.assignments_submitted = data.learning_content.materials.assignments_submitted;
        $scope.total_units = data.total_units;

        $scope.avg_units_visited_by_students = data.avg_units_visited_by_students;
        $scope.avg_score_by_students = data.avg_score_by_students;
        $scope.units_visited_by_me = data.units_visited_by_me;
        $scope.avg_score_by_me = data.avg_score_by_me;


        //jQuery handle data
        $scope.$applyAsync(function() {

          var $ = window.jQuery;

          //jQuery nestable
          $('.dd').nestable();

          $('.dd-handle a').on('mousedown', function (e) {
            e.stopPropagation();
          });


          $(".dd-nodrag").on("mousedown", function(event) { // mousedown prevent nestable click
            event.preventDefault();
            return false;
          });


          $(".dd-nodrag").on("touchcancel", function(event) { // touch event
            event.preventDefault();
            return false;
          });

          //Easy pie chart
          $('.easy-pie-chart.percentage').each(function(){
            var $box = $(this).closest('.infobox');
            var barColor = $(this).data('color') || (!$box.hasClass('infobox-dark') ? $box.css('color') : 'rgba(255,255,255,0.95)');
            var trackColor = barColor === 'rgba(255,255,255,0.95)' ? 'rgba(255,255,255,0.25)' : '#E2E2E2';
            var size = parseInt($(this).data('size')) || 50;
            $(this).easyPieChart({
              barColor: barColor,
              trackColor: trackColor,
              scaleColor: false,
              lineCap: 'butt',
              lineWidth: parseInt(size/10),
              animate: /msie\s*(8|7|6)/.test(navigator.userAgent.toLowerCase()) ? false : 1000,
              size: size
            });
          });
        });

        $scope.unitAjaxInProgress = false;


      }, function (response) {

        handleErrorMessage(response);

      });
    };


    $scope.loadLessons = function () {
      if ( loadedTabs.indexOf('lessons') !== -1 ) {
        emulatePostponedResize();
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
        $scope.assignmentsConfig.title.align = 'left';
        $scope.assignmentsConfig.title.margin = 25;
        $scope.assignmentsConfig.title.style = {
          color: color_emma_green,
        };




        $scope.assignmentsConfig.loading = false;

        $scope.unitAjaxInProgress = false;

        $scope.unitResources = data.resources;
      }, function (response) {
        handleErrorMessage(response);
        $scope.unitAjaxInProgress = false;
      });
    };

    $scope.loadSna = function () {


      if ( loadedTabs.indexOf('sna') !== -1 ) {
        emulatePostponedResize();
        return;
      }

      loadedTabs.push('sna');

      apiService.sna({
        id: courseId
      }, function (data) {
        $scope.snaData = {
          nodes: data.nodes,
          edges: data.edges,
          loading: false
        };
      }, function (response) {
        handleErrorMessage(response);
      });
    };

    $scope.isTeacherDashboard = function() {
      return dashboardType === 'teacher';
    };

    $scope.isStudentDashboard = function() {
      return dashboardType === 'student';
    };

    $scope.isAnyDashboard = function() {
      return true;
    };

  });
