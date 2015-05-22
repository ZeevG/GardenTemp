'use strict';

/**
 * @ngdoc function
 * @name gardenTempApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the gardenTempApp
 */
angular.module('gardenTempApp')
  .controller('MainCtrl', ['$scope', '$http', 'googleChartApiPromise', '$interval', function ($scope, $http, googleChartApiPromise, $interval) {

    // Defining all chart specific constants here
    var url = 'https://data.sparkfun.com/output/bGb7w7O557Ip18wAnXog.json?limit=5040';
    var chartType = 'LineChart';
    var options = {
                  chart: {
                    type: 'multiChart',
                    height: 600,
                    margin : {
                        top: 80,
                        right: 80,
                        bottom: 80,
                        left: 80
                    },
                    color: [
                      "#ff7f0e",
                      "#99ccff"
                    ],
                    x : function(d) {
                        return d.x;
                        },
                    y : function(d) {
                          return d.y;
                    },
                    interpolate: 'basis',
                    useInteractiveGuideline: true,
                    xAxis: {
                      axisLabel: 'X Axis',
                      showMaxMin: false,
                      staggerLabels: false,
                      tickFormat: function(d){
                        return d3.time.format('%I%p %a')(new Date(d));
                      }
                    },
                    yAxis1: {
                        axisLabel: 'Humidity',
                        tickFormat: function(d){
                            return d3.format(',.2f')(d) + "%";
                        },
                        tickPadding: 20,
                        rotateYLabel: false,
                        showMaxMin: false,
                    },
                    yAxis2: {
                        axisLabel: 'Temperature',
                        tickFormat: function(d){
                            return d3.format(',.2f')(d) + "C";
                        },
                        rotateYLabel: false,
                        showMaxMin: false,
                    }
                  }
                  };

    $scope.options = options;

    // Do stuff! Query the data.sparkfun.com Phant API
    function generateChart(){
      $http.get(url)
      .success(function(data, status, headers, config) {
        $scope.data = [{
                  key: 'Temperature',
                  values: [],
                  type: 'line',
                  yAxis: 2
              },
              {
                  key: 'Humidity',
                  values: [],
                  type: 'line',
                  yAxis: 1
              }];

        for(var ii = 0; ii<data.length; ii++){
          if(ii%40 == 0){
            var value = data[ii];
            $scope.data[0].values.push({y: value.temp, x: new Date(value.timestamp).valueOf()});
            $scope.data[1].values.push({y: value.humidity, x: new Date(value.timestamp).valueOf()});
          }
        }
      })
      // Hmm, something went wrong with the Sparkfun Phant API
      .error(function(data, status, headers, config) {
        console.log('problemo!');
      });
    }

    generateChart();
    $interval(generateChart, 120000); // 2 mins


  }]);
