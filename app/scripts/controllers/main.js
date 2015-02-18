'use strict';

/**
 * @ngdoc function
 * @name gardenTempApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the gardenTempApp
 */
angular.module('gardenTempApp')
  .controller('MainCtrl', ['$scope', '$http', 'googleChartApiPromise', '$timeout', function ($scope, $http, googleChartApiPromise, $timeout) {

    // Defining all chart specific constants here
    var url = 'https://data.sparkfun.com/output/bGb7w7O557Ip18wAnXog.json?limit=96';
    var chartType = 'LineChart';
    var googleChartOptions = {
        'title': 'Garden Temperature',
        'displayExactValues': true,
        'vAxis': {
            'title': 'Temperature',
            "gridlines": {
              "count": 10
            }
        },
        'hAxis': {
            'title': 'Date Time'
        },
        curveType: 'function',
        legend: { position: 'bottom' },
        animation: {startup: true, duration: 5},
        explorer: {},
        width: 700,
        height: 400
    };


    // Do stuff! Query the data.sparkfun.com Phant API
    function generateChart(){
      $http.get(url).
        success(function(data, status, headers, config) {

          // We have the data - wait for the Google Charts Library
          googleChartApiPromise.then(function(){
            $scope.chartObject = {};
            $scope.chartObject.data = parseData(data);
            $scope.chartObject.type = chartType;
            
            $scope.chartObject.options = googleChartOptions;
          });
        }).
        // Hmm, something went wrong with the Sparkfun Phant API
        error(function(data, status, headers, config) {
          console.log('problemo!');
        });
      }
      
      function parseData(data){

        var chartData = {
          'cols': [
            {id: 't', label: 'Time', type: 'datetime'},
            {id: 's', label: 'Temperature', type: 'number'}
          ],
          'rows': [],
        };

        for(var ii = 0; ii < data.length; ii++){
          var record = [
            {'v': new Date(data[ii].timestamp)},
            {'v': data[ii].temp}
          ];
          chartData.rows.unshift({'c': record});
        }
        return chartData;
      }

      generateChart();
      $timeout(generateChart, 900000) // 15 mins

  }]);
