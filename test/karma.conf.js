// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html
// Generated on 2015-09-14 using
// generator-karma 1.0.0

module.exports = function(config) {
  'use strict';

  config.set({
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // base path, that will be used to resolve files and exclude
    basePath: '../',

    // testing framework to use (jasmine/mocha/qunit/...)
    // as well as any additional frameworks (requirejs/chai/sinon/...)
    frameworks: [
      "jasmine"
    ],

    // list of files / patterns to load in the browser
    files: [
      // bower:js
      'bower_components/jquery/dist/jquery.js',
      'bower_components/angular/angular.js',
      'bower_components/bootstrap-sass-official/assets/javascripts/bootstrap.js',
      'bower_components/angular-animate/angular-animate.js',
      'bower_components/angular-resource/angular-resource.js',
      'bower_components/angular-sanitize/angular-sanitize.js',
      'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'bower_components/highcharts/highcharts.js',
      'bower_components/highcharts/highcharts-more.js',
      'bower_components/highcharts/modules/exporting.js',
      'bower_components/highcharts-ng/dist/highcharts-ng.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/sigma.js/sigma.min.js',
      'bower_components/sigma.js/plugins/sigma.layout.forceAtlas2.min.js',
      'bower_components/sigma.js/plugins/sigma.parsers.gexf.min.js',
      'bower_components/sigma.js/plugins/sigma.parsers.json.min.js',
      'bower_components/sigma.js/plugins/sigma.plugins.animate.min.js',
      'bower_components/sigma.js/plugins/sigma.plugins.dragNodes.min.js',
      'bower_components/sigma.js/plugins/sigma.plugins.filter.min.js',
      'bower_components/sigma.js/plugins/sigma.plugins.neighborhoods.min.js',
      'bower_components/sigma.js/plugins/sigma.renderers.customEdgeShapes.min.js',
      'bower_components/sigma.js/plugins/sigma.renderers.customShapes.min.js',
      'bower_components/sigma.js/plugins/sigma.renderers.edgeLabels.min.js',
      'bower_components/sigma.js/plugins/sigma.statistics.HITS.min.js',
      'bower_components/angular-mocks/angular-mocks.js',
      // endbower
      "app/scripts/**/*.js",
      "test/mock/**/*.js",
      "test/spec/**/*.js"
    ],

    // list of files / patterns to exclude
    exclude: [
    ],

    // web server port
    port: 8080,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: [
      "PhantomJS"
    ],

    // Which plugins to enable
    plugins: [
      "karma-phantomjs-launcher",
      "karma-jasmine"
    ],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    colors: true,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    // Uncomment the following lines if you are using grunt's server to run the tests
    // proxies: {
    //   '/': 'http://localhost:9000/'
    // },
    // URL root prevent conflicts with the site root
    // urlRoot: '_karma_'
  });
};
