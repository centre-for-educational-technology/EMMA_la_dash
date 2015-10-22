'use strict';

/**
 * @ngdoc directive
 * @name emmaDashboardApp.directive:sigmajs
 * @description
 * # sigmajs
 */

// Based on this Gist at https://gist.github.com/patrickfav/cd20939b383b9c284511
// And example of neighbours from project page at http://sigmajs.org/

// XXX This directive kills sigmajs instance every time $destroy is calles
// It also recreates the instane for each chage to the data set
// This is a bad approach but it seems to work just fine for the current need

angular.module('emmaDashboardApp')
  .directive('sigmajs', function ($window) {
    var s = null;
    var containerId = 'sigmajs-container' + Math.random() * 9999,
        notKeptColor = '#eee',
        w = angular.element($window);

    // Add a generally available method to sigmajs graph
    window.sigma.classes.graph.addMethod('neighbors', function(nodeId) {
      var k,
          neighbors = {},
          index = this.allNeighborsIndex[nodeId] || {};

      for (k in index) {
        neighbors[k] = this.nodesIndex[k];
      }

      return neighbors;
    });

    return {
      template: '<div id="' + containerId + '" style="min-height:500px;"></div>',
      restrict: 'E',
      scope: {
        graph: '='
      },
      link: function postLink(scope, element) {

        scope.$watch('graph', function () {

          if ( !s ) {
            s = new window.sigma({
              renderers: [
                {
                  container: document.getElementById(containerId)
                }
              ],
              settings: {
                defaultNodeColor: '#ec5148',
                minNodeSize: 1,
                maxNodeSize: 10,
                minEdgeSize: 1,
                maxEdgeSize: 2.5,
                hideEdgesOnMove: true
              }
            });

            s.bind('clickNode', function(e) {
                var nodeId = e.data.node.id,
                    toKeep = s.graph.neighbors(nodeId);
                toKeep[nodeId] = e.data.node;

                s.graph.nodes().forEach(function(n) {
                  if (toKeep[n.id]) {
                    n.color = n.originalColor;
                  } else {
                    n.color = notKeptColor;
                  }
                });

                s.graph.edges().forEach(function(e) {
                  if (toKeep[e.source] && toKeep[e.target]) {
                    e.color = e.originalColor;
                  } else {
                    e.color = notKeptColor;
                  }
                });

                // Since the data has been modified, we need to
                // call the refresh method to make the colors
                // update effective.
                s.refresh();
              });

              s.bind('clickStage', function() {
                s.graph.nodes().forEach(function(n) {
                  n.color = n.originalColor;
                });

                s.graph.edges().forEach(function(e) {
                  e.color = e.originalColor;
                });

                // Same as in the previous event:
                s.refresh();
              });
          }

          s.render();
          s.graph.clear();
          s.graph.read(scope.graph);

          s.graph.nodes().forEach(function(node) {
            node.originalColor = node.color;
            node.x = Math.random();
            node.y = Math.random();
          });

          s.graph.edges().forEach(function(edge) {
            edge.originalColor = edge.color;
          });

          s.refresh();
        });

        element.on('$destroy', function() {
          s.kill();
          s = null;
        });

        w.bind('resize', function () {
          var child = element.children()[0];
          angular.element(child).css('height', w.height() - 100).css('width', w.width() - 30);
          if ( s ) {
            s.refresh();
          }
        });
      }
    };
  });
