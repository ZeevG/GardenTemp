'use strict';

/**
 * @ngdoc overview
 * @name gardenTempApp
 * @description
 * # gardenTempApp
 *
 * Main module of the application.
 */
angular
  .module('gardenTempApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'googlechart'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }).value('googleChartApiConfig', {
    version: '1.1',
    optionalSettings: {
      packages: ['line', 'bar'],
      language: 'en'
    }
  });
