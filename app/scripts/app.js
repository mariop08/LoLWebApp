'use strict';

/**
 * @ngdoc overview
 * @name leagueApp
 * @description
 * # leagueApp
 *
 * Main module of the application.
 */
var leagueApp = angular.module('leagueApp',
  [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ]);

leagueApp.config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/app'
      });
  });
