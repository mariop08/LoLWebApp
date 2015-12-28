'use strict';

/**
 * @ngdoc function
 * @name leagueApp.controller:SearchBarCtrl
 * @description
 * # SearchBarCtrl
 * Controller of the leagueApp
 */
angular.module('leagueApp')
  .controller('SearchBarCtrl', ['$scope', '$http' , 'summonerFactory' , function ($scope, $http, summonerFactory) {

	  $scope.regions = [
					  'NA',
					  'KR',
					  'LAN',
					  'EUW',
					  'RU',
					  'TR',
					  'BR',
					  'OCE',
					  'LAS'
					  ];

	  $scope.selectedRegion = 'NA';



    $scope.dropDownSelectedItem = function(region){
      $scope.selectedRegion = region;

      console.log($scope.selectedRegion);
    };

    //$scope.submitSummoner = function (summoner) {

    //  summoner.region = $scope.selectedRegion;

      //$scope.summonerID = SearchService.idLookup(summoner);

      //$http.get('https://'+summoner.region+'.api.pvp.net/api/lol/na/v1.4/summoner/by-name/'+summoner.name
      //  +'?api_key=29993728-af63-4ecd-84d8-fdd068d9d11a')
      //  .success(function(res) {
      //    $scope.info = res[summoner.name];
      //
      //    console.log($scope.info);
      //  });


    //}

    $scope.submitSummoner = function getSummonerID(summoner) {

      summoner.region = $scope.selectedRegion;

      summonerFactory.getSummonerID(summoner)
        .success(function (res){
          summoner.id = res[summoner.name].id;
          console.log(summoner);

          $scope.getSummonerMasteries(summoner);
          $scope.getSummonerRunes(summoner);
        })
        .error(function (error){
          console.log("Unable to get Summoner ID data: " + error.message);
        });
    };

    $scope.getSummonerMasteries = function (summoner) {
      summonerFactory.getSummonerMasteries(summoner)
        .success( function (res) {
          summoner.masteries = res[summoner.id].pages;
          console.log(summoner.masteries);
        })
        .error(function (error) {
          console.log("Unable to get Summoner Masteries: " + error.message);
        });
    };

    $scope.getSummonerRunes = function (summoner) {
      summonerFactory.getSummonerRunes(summoner)
        .success( function (res) {
          summoner.runes = res[summoner.id].pages;
          console.log(summoner.runes);
        })
        .error(function (error) {
          console.log("Unable to get Summoner Runes: " + error.message);
        });
    };

  }]);
