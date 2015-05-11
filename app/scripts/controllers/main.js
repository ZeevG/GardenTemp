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
    var url = 'https://data.sparkfun.com/output/bGb7w7O557Ip18wAnXog.json?limit=10080';
    var chartType = 'LineChart';
    var googleChartOptions = {
        'title': 'Garden Temperature',
        'displayExactValues': true,
        'vAxis': [{
          'title': 'Humidity',
          'gridlines': {
            'count': 10
          },
          'maxValue': 100,
        },{
            'title': 'Temperature',
            'gridlines': {
              'count': 10
            }
        }],
        'hAxis': {
            'title': 'Date Time'
        },
        series:{
           0:{targetAxisIndex:1},
           1:{targetAxisIndex:0, 'color': '#808080', lineWidth: 1}
        },

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

      function movingAverage(data, index, window){
        var start = index - Number(window/2);
        if(start < 0){
          start = 0;
        }

        var end = index + Number(window/2);
        if(end >= data.length){
          end = data.length - 1;
        }

        var temp = 0;
        var humidity = 0;
        var range = end - start;
        for(var ii = 0; ii < range; ii++){
          temp = temp + Number(data[start + ii].temp);
          humidity = humidity + Number(data[start + ii].humidity);
        }

        return {'temp':(temp/range), 'humidity':(humidity/range)};

      }
      
      function parseData(data){

        var chartData = {
          'cols': [
            {id: 't', label: 'Time', type: 'datetime'},
            {id: 's', label: 'Temperature', type: 'number'},
            {id: 'h', label: 'Humidity', type: 'number'}
          ],
          'rows': [],
        };

        for(var ii = 0; ii < data.length; ii++){

          var averagedPoint = movingAverage(data, ii, 30)
          var record = [
            {'v': new Date(data[ii].timestamp)},
            {'v': Number(averagedPoint.temp).toFixed(2)},
            {'v': Number(averagedPoint.humidity).toFixed(2)}
          ];
          chartData.rows.unshift({'c': record});
          ii = ii + 10;
        }
        return chartData;
      }

      generateChart();
      $timeout(generateChart, 120000); // 2 mins

  }]);
