var mongoose = require('mongoose');
var express = require('express');

////Imnportant KEY //////////////////////////////////////////////
var https = 'https://';
var key = '?api_key=29993728-af63-4ecd-84d8-fdd068d9d11a';
////////////////////////////////////////////////////////////////
var Summoner = require('../models/summoner');
var request = require('request');

var router = express.Router();

//Gets Recent Game Object
router.route('/:summonername/:region')
    .get(function(req,res){
      var sname = req.params.summonername;
      Summoner.findOne({$or:[{name: sname}, {altname: sname.toLowerCase().replace(/ /g,'')}]},
      '-_id id name profileIconId summonerLevel revisionDate altname', function(err, summoner) {
        //console.log(summoner);
        if(err)
          res.send(err);
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
                      //returns an array of 1o recent matches
                      res.json(recentGameInfo);
                    }
                    else {
                      //print error message
                      res.status(response.statusCode).send(body);

                    }
                  });
              }
              else {
                console.log(response.statusCode);
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
                //returns an array of 10 recent matches
                res.json(recentGameInfo);
              }
              else {
                //print error message
                res.status(response.statusCode).send(body);
              }
            });
        }
      });
    });

module.exports = router;
