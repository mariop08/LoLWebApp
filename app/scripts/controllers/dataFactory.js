/**
 * Created by Mario on 12/27/2015.
 */
'use strict';

angular.module('leagueApp')
  .factory('summonerFactory', ['$http', function($http) {

    var https = 'https://';
    var key = '?api_key=29993728-af63-4ecd-84d8-fdd068d9d11a';

    var dataFactory = {};

    summonerFactory.getSummonerID = function (summoner) {
      return $http.get(https+ summoner.region + '.api.pvp.net/api/lol/na/v1.4/summoner/by-name/'
        + summoner.name + key);
    };

    summonerFactory.getSummonerMasteries = function (summoner) {
      return $http.get(https+ summoner.region + '.api.pvp.net/api/lol/na/v1.4/summoner/'
        + summoner.id + '/masteries' + key);
    };

    return dataFactory;
  }]);
