'use strict';

/**
 * @ngdoc function
 * @name emmaDashboardApp.controller:CourseCtrl
 * @description
 * # CourseCtrl
 * Controller of the emmaDashboardApp
 */
angular.module('emmaDashboardApp')
  .controller('CourseCtrl', function ($scope, $window, $routeParams, apiService, systemMessagesService, dashboardType, $sce) {
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

      systemMessagesService.addDanger('Error: Serice responded with code ' + response.status + ' and message ' + message);
    }

    function pretendResize () {
      w.resize();
    }

    function emulatePostponedResize () {
      setTimeout(function () {
        window.dispatchEvent(new Event('resize'));
      }, 100);
    }

    $scope.popoverData = {
      generalStatistics: {
        title: 'What is it?',
        content: $sce.trustAsHtml('Graphic combines list of all lessons, number of interactions and average time spent on lessons by users.<br><br>Interactions are page views which includes lessons, units, studu materials, assignments etc.<br><br>Time spent is a sum of time that user has spent on each page inside of the lesson.')
      },
      mostPopularResources: {
        title: 'What is it?',
        content: $sce.trustAsHtml('Most popular resources is a list of resources (pages, learning materials, blog posts etc). Number of views illustratates the number of clicks made on specific resource.<br><br>Note that some resources links to the same page but the title is in different language which visualises user preferences taking a specific course.')
      },
      learningContent: {
        title: 'What is it?',
        content: $sce.trustAsHtml('Current graph visualises the number of enrolled users have accessed unit, study materials and hyperlinks in current unit. Hover over bars to view number of users.')
      },
      assignments: {
        title: 'What is it?',
        content: $sce.trustAsHtml('Current graph visualises the number of enrolled users have viewed and submitted assignments. Hover over bars to view number of users.')
      },
      enrollmentHistory: {
        title: 'What is it?',
        content: $sce.trustAsHtml('Enrollment history gives an overview of enrolled and unenrolled users over time. Hover over bars to see exact number of activity.<br><br>Open tabs to see enrolled and unenrolled student’s name and e-mail address.')
      },
      activityStream: {
        title: 'What is it?',
        content: $sce.trustAsHtml('Acitivity stream visualises 100 latest activities by current course participants and facilitators.<br><br>If there is less than 100 activities per latest day, next date with an at least one activity is being shown.<br><br>Link next to the verb links to specific resource.')
      },
      sna: {
        title: 'What is it?',
        content: $sce.trustAsHtml('Social Network Analysis (SNA) graph visualises connections between MOOC participants and facilitators based on conversations.<br><br>Hover over dots (person) to see full name. Lines represents conversation between users.<br><br>Click on dot (person) to highlight connections.<br><br>Zoom In or Out by scrolling or doubleclick to Zoom In.')
      },
      studentProgress: {
        title: 'What is it?',
        content: $sce.trustAsHtml('Your progress during the course is presented here. Average score is calculated for all passed quizzes.<br><br>Open “Find out how the other students did” for comparsion to other participants. Stay motivated!')
      },
      studentCourseStructure: {
        title: 'What is it?',
        content: $sce.trustAsHtml('Course structure is presented as a tree view: lesson is on the first level, units are on the second and assigments are on the third one.<br><br>Unit is marked as done if participant has opened all the pages under it. An assignment score is marked in green if it is a successful result, otherwise in red')
      }
    };

    $scope.snaData = {
      nodes: [],
      edges: [],
      loading: true,
      noConnections: false
    };

    $scope.learningContentConfig = {

      options: {
        chart: {
          type: 'column'
        },
        title: {
          text: '',
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
              text += '<span>' + this.point.unique_users + ' unique users (' + this.y.toFixed(2) + ')% have <span style="color:'+ this.color + ';text-transform:lowercase;font-weight:bold;">submitted</span> ' + this.point.submitted_assignments + ' <span style="color:'+ this.color + ';text-transform:lowercase;font-weight:bold;">assignments</span> in current unit</span><br>';
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
      series: [],
      edbCount: 0
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
        text: '',
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
        text: '',
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
          valueSuffix: ' minutes'
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
        $scope.activityCount = data.count;
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
        $scope.lessons_visited = data.learning_content.materials.lessons_visited;


        $scope.all_units = data.learning_content.materials.all_units;
        $scope.units_visited = data.learning_content.materials.units_visited;

        $scope.assignments = data.assignments;
        $scope.assignments_visited = data.learning_content.materials.assignments_visited;
        $scope.assignments_submitted = data.learning_content.materials.assignments_submitted;
        $scope.total_units = data.total_units;

        $scope.avg_units_visited_by_students = data.avg_units_visited_by_students;
        $scope.avg_score_by_students = data.avg_score_by_students;
        $scope.units_visited_by_me = data.units_visited_by_me;
        $scope.avg_score_by_me = data.avg_score_by_me;

        $scope.posts_made_by_me = data.posts_made_by_me;
        $scope.posts_made_by_others = data.posts_made_by_others;

        $scope.comments_made_by_me = data.comments_made_by_me;
        $scope.comments_made_by_others = data.comments_made_by_others;


        //jQuery handle data
        $scope.$applyAsync(function() {

          var $ = window.jQuery;

          //jQuery nestable
          $('.dd').nestable();

          $('.dd-handle a').on('mousedown', function (e) {
            e.stopPropagation();
          });

          var easy_pie_chart_others = function() {

            //Easy pie chart
            $('.easy-pie-chart.percentage.others-chart').each(function(){
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

          };

          var easy_pie_chart_my = function() {

            $('.easy-pie-chart.percentage.my-chart').each(function(){
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

          };


          $('.widget-toolbar a').on('click', function (e) {
            e.preventDefault();
            easy_pie_chart_others();

          });

          $('.widget-toolbar a').on('touchmove', function (e) {
            e.preventDefault();

            easy_pie_chart_others();
          });



          $(".dd-nodrag").on("mousedown", function(event) { // mousedown prevent nestable click
            event.preventDefault();
            return false;
          });


          $(".dd-nodrag").on("touchmove", function(event) { // touch event
            event.preventDefault();
            return false;
          });

          //Easy pie chart
          easy_pie_chart_my();

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

        $scope.assignmentsConfig.edbCount = data.assignments_count;

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
          loading: false,
          noConnections: ( data.edges.length > 0 ) ? false : true
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
