'use strict';

/**
 * @ngdoc function
 * @name leagueApp.controller:SearchBarCtrl
 * @description
 * # SearchBarCtrl
 * Controller of the leagueApp
 */
leagueApp
  .controller('SearchBarCtrl', ['$scope' , 'summonerFactory' , function ($scope, summonerFactory) {

    $scope.selectedRegion = 'NA';

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

	  




    // $scope.dropDownSelectedItem = function(region){
    //   $scope.selectedRegion = region;

    //   console.log($scope.selectedRegion);
    // };

    $scope.getMatchList = function(summoner) {

      summoner.region = $scope.selectedRegion.toLowerCase();
      console.log(summoner.region + ' ' + summoner.name);

      summonerFactory.getMatchList(summoner)
        .success(function (res){
          summoner.id = res.summoner.id;
          console.log(summoner);

          //need a separate username variable without the two way binding
          summoner.username = res.summoner.name;
          summoner.profileIconSrc = "http://ddragon.leagueoflegends.com/cdn/5.24.2/img/profileicon/"+ res.summoner.profileIconId+".png";
          summoner.level = res.summoner.summonerLevel;

          //$scope.getSummonerMasteries(summoner);
          //$scope.getSummonerRunes(summoner);

          //for controlling ng-show directive in main.html
          summoner.show = true;
          summoner.error = false;
        })
        .error(function (error){
          console.log("Unable to get Summoner ID data: " + error.message);

          //for controlling ng-show directive in main.html
          summoner.error = true;
          summoner.show = false;
        });
    };

    $scope.getRecentGame = function(summoner) {
      $scope.selectedRegion = summoner.region;
      // summoner.region = $scope.selectedRegion;
      summonerFactory.getRecentGame(summoner)
        .success(function(res) {
          console.log(res);
          $scope.summonerInfo = res.summonerInfo;
          $scope.recentGames = res.games;

          //for controlling ng-show directive in main.html
          $scope.summoner.show = true;
          $scope.summoner.error = false;
        })
        .error(function (error){
          console.log("Unable to get recent game data: " + error.message);

          //for controlling ng-show directive in main.html
          summoner.error = true;
          summoner.show = false;
        });
    }

    // $scope.getSummonerMasteries = function (summoner) {
    //   summonerFactory.getSummonerMasteries(summoner)
    //     .success( function (res) {
    //       summoner.masteries = res.summoner.pages;
    //       console.log(summoner.masteries);
    //     })
    //     .error(function (error) {
    //       console.log("Unable to get Summoner Masteries: " + error.message);
    //     });
    // };
    //
    // $scope.getSummonerRunes = function (summoner) {
    //   summonerFactory.getSummonerRunes(summoner)
    //     .success( function (res) {
    //       summoner.runes = res.summoner.pages;
    //       console.log(summoner.runes);
    //     })
    //     .error(function (error) {
    //       console.log("Unable to get Summoner Runes: " + error.message);
    //     });
    // };

  }]);
