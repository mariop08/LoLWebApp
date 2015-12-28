'use strict';

/**
 * @ngdoc function
 * @name leagueApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the leagueApp
 */
angular.module('leagueApp')
  .controller('MainCtrl', function () {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    //change the active navigation menu
    angular.element('.nav li.active').removeClass('active');
    angular.element('.nav li').eq(0).addClass('active');
  });
