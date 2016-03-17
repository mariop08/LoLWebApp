var mongoose = require('mongoose');
var express = require('express');
var config = require('../config');

var https = 'https://';
var key = config.LeagueAPI.key;
var Summoner = require('../models/summoner');
var Champion = require('../models/champion');
var Spell = require('../models/spell');
var request = require('request');

var router = express.Router();

//Gets Recent Game Object
router.route('/:summonername/:region').get(function(req,res){
  var sname = req.params.summonername;
  Summoner.findOne({ $or : [{name: sname}, {altname : sname.toLowerCase().replace(/ /g,'')}] },
  '-_id id name profileIconId summonerLevel revisionDate altname', function(err, summoner) {
    //console.log(summoner);
    if(err)
      res.send(err);
    //run if summoner info is not in the db
    else if(!summoner){
      sname = req.params.summonername.toLowerCase().replace(/ /g,'');
      console.log('Summoner not found in DB, calling API');
      request(
        https + req.params.region + '.api.pvp.net/api/lol/' + req.params.region + '/v1.4/summoner/by-name/'
        + sname + key,
        function(error,response,body) {
          if(!error && response.statusCode == 200) {
            var summonerInfo = JSON.parse(body);
            console.log(summonerInfo);
            var summonerId = summonerInfo[sname].id;
            summonerInfo[sname].altname = sname;

            //Add Create Summoner Record in DB
            Summoner.create(summonerInfo[sname], function (err, res) {
              if (err) return handleError(err);
              // saved!
              console.log('Record for Summoner:', summonerInfo[sname].name," was created.");
            });

            //Call get recentgame api
            request(
              https + req.params.region + '.api.pvp.net/api/lol/' + req.params.region + '/v1.3/game/by-summoner/'
            + summonerId + '/recent' + key,
              function(error,response,body) {
                if(!error && response.statusCode == 200) {
                  var recentGameInfo = JSON.parse(body);
                  //append summoner info
                  recentGameInfo.summonerInfo = summonerInfo[sname];
                  //append static champions info
                  Champion.find({}, function(err, champInfo) {
                    recentGameInfo.championInfo = champInfo;
                    //append static spells info
                    Spell.find({}, function(err, spellInfo) {
                      recentGameInfo.spellInfo = spellInfo;
                      console.log(recentGameInfo.spellInfo);
                      //returns an array of 10 recent matches + summoner info + champions info
                      res.json(recentGameInfo);
                    })
                  });
                }
                else {
                  res.status(response.statusCode).send(body);
                }
              });
          }
          else {
            res.status(response.statusCode).send(body);
          }
      });
    }
    else {
      //Call get recentgame api
      console.log("Summmoner record found in DB: ", summoner["id"]);
      request(
        https + req.params.region + '.api.pvp.net/api/lol/' + req.params.region + '/v1.3/game/by-summoner/'
            + summoner["id"] + '/recent' + key,
        function(error,response,body) {
          if(!error && response.statusCode == 200) {
            var recentGameInfo = JSON.parse(body);
             //append summoner info
             recentGameInfo.summonerInfo = summoner;
             //append static champions info
             Champion.find({}, function(err, champInfo) {
               recentGameInfo.championInfo = champInfo;
               //append static spells info
               Spell.find({}, function(err, spellInfo) {
                 recentGameInfo.spellInfo = spellInfo;
                 console.log(recentGameInfo.spellInfo);
                 //returns an array of 10 recent matches + summoner info + champions info
                 res.json(recentGameInfo);
               })
             });
          }
          else {
            res.status(response.statusCode).send(body);
          }
        });
    }
  });
});

module.exports = router;
