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
    $scope.getMatch = function(summoner) {

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
    
    //data array
    var totalDamageDealtArray = [
          {
            "championId" : 78,
            "totalDamageDealt" : 11111
          },
          {
            "championId" : 71,
            "totalDamageDealt" : 33333
          },
          {
            "championId" : 72,
            "totalDamageDealt" : 80000
          },
          {
            "championId" : 73,
            "totalDamageDealt" : 22345
          },
          {
            "championId" : 74,
            "totalDamageDealt" : 33421
          },
          {
            "championId" : 75,
            "totalDamageDealt" : 11245
          },
          {
            "championId" : 76,
            "totalDamageDealt" : 4794
          },
          {
            "championId" : 77,
            "totalDamageDealt" : 23545
          },
          {
            "championId" : 79,
            "totalDamageDealt" : 60075
          },
          {
            "championId" : 70,
            "totalDamageDealt" : 37545
          }
        ];

        createPieChart("pieChart1", totalDamageDealtArray);

  }]);
