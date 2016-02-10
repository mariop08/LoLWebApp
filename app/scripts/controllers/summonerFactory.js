/**
 * Created by Mario on 12/27/2015.
 */
'use strict';

leagueApp
  .factory('summonerFactory', ['$http', function($http) {

    var https = 'https://';
    var summonerFactory = {};

    summonerFactory.getMatchList = function (summoner) {
      return $http.get('/api/matchlist/' + summoner.name + '/' + summoner.region);
    };


    // summonerFactory.getSummonerMasteries = function (summoner) {
    //   return $http.get(https+ summoner.region + '.api.pvp.net/api/lol/' + summoner.region + '/v1.4/summoner/'
    //     + summoner.id + '/masteries' + key);
    // };
    //
    // summonerFactory.getSummonerRunes = function (summoner) {
    //   return $http.get(https+ summoner.region + '.api.pvp.net/api/lol/' + summoner.region + '/v1.4/summoner/'
    //     + summoner.id + '/runes' + key);
    // };

    return summonerFactory;
  }]);
