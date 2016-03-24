'use strict';

leagueApp
  .controller('SidebarCtrl', function ($scope, $mdSidenav) {

  	$scope.toggle = function(){ $mdSidenav('left').toggle()};
  });