'use strict';

/**
 * @ngdoc function
 * @name leagueApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the leagueApp
 */
leagueApp
  .controller('AboutCtrl', function () {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    //change the active navigation menu
    angular.element('.nav li.active').removeClass('active');
    angular.element('.nav li').eq(1).addClass('active');

  });
