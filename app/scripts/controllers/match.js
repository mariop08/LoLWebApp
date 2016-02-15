'use strict';

/**
 * @ngdoc function
 * @name leagueApp.controller:MatchCtrl
 * @description
 * # MatchCtrl
 * Controller of the leagueApp
 */
leagueApp
  .controller('MatchCtrl', ['$scope' , 'summonerFactory' , function ($scope, summonerFactory) {
    $scope.getMatchList = function(summoner) {

      match.region = $scope.selectedRegion;

      summonerFactory.getMatch(match)
        .success(function (res){
         
        })
        .error(function (error){
          console.log("Unable to get match data: " + error.message);

          //for controlling ng-show directive in main.html
          // summoner.error = true;
          // summoner.show = false;
        });
    };

  }]);
