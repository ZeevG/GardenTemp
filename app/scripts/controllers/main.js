'use strict';

/**
 * @ngdoc function
 * @name gardenTempApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the gardenTempApp
 */
angular.module('gardenTempApp')
  .controller('MainCtrl', ['$scope', '$http', function ($scope, $http) {

    var url = 'https://data.sparkfun.com/output/bGb7w7O557Ip18wAnXog.json';

    $http.get(url).
      success(function(data, status, headers, config) {
        console.log(data, status, headers, config);

        $scope.chartObject = {};

        $scope.chartObject.data = {
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

          $scope.chartObject.data['rows'].unshift({'c': record});
        }

        $scope.chartObject.type = 'google.charts.Line';
        $scope.chartObject.options = {
            'title': 'Garden Temperature',
            'displayExactValues': true,
            'vAxis': {
                'title': 'Temperature'
            },
            'hAxis': {
                'title': 'Date Time'
            },
            curveType: 'function',
            // legend: { position: 'bottom' },
            explorer: {},
            width: 700,
            height: 400
        };


      }).
      error(function(data, status, headers, config) {
        console.log('problemo!');
      });
  }]);
