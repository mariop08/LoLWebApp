var mongoose = require('mongoose');
var express = require('express');
var config = require('../config');

var https = 'https://';
var key = config.LeagueAPI.key;
var Summoner = require('../models/summoner');
var request = require('request');

var router = express.Router();

//Gets Summoner ID from either DB or API
//summonername: Summoner name which will be used to find ID
//region: Region of summoner, must be provided for now, consider cookie or session variable to store
router.route('/:summonername/:region')

  .get(function(req,res){
    var sname = req.params.summonername;
    //findOne({$or: [{name:"QuantumMiku"},{altname:"quantummiku"}]})
    Summoner.findOne({$or: [{name: sname}, {altname: sname.toLowerCase().replace(/ /g,'')}]},
    '-_id id name profileIconId summonerLevel revisionDate altname', function(err, summoner) {
      console.log(https + req.params.region + '.api.pvp.net/api/lol/' + req.params.region + '/v1.4/summoner/by-name/'
      + sname);
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
              console.log(summonerInfo[sname].altname);
              //Add Create Summoner Record in DB
              Summoner.create(summonerInfo[sname], function (err, res) {
                if (err) return handleError(err);
                // saved!
                console.log('Record for Summoner:', summonerInfo[sname].name," was created.");
                console.log(summonerInfo[sname]);
              });

              //Call get matchlist api
              //https://na.api.pvp.net/api/lol/na/v2.2/matchlist/by-summoner/27930921?api_key=####
              request(
                https + req.params.region + '.api.pvp.net/api/lol/' + req.params.region + '/v2.2/matchlist/by-summoner/'
                + summonerId + key,
                function(error,response,body) {
                  if(!error && response.statusCode == 200) {
                    var matchlistInfo = JSON.parse(body);
                    //Append Summoner Information to Matchlist Object
                    matchlistInfo.summoner = summonerInfo[sname];
                    //returns an array of previous matches
                    res.json(matchlistInfo);
                  }
                  else {
                    //print error message
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
        //Call get matchlist api
        //https://na.api.pvp.net/api/lol/na/v2.2/matchlist/by-summoner/27930921?api_k
        console.log("Summmoner record found in DB: ", summoner.name);
        request(
          https + req.params.region + '.api.pvp.net/api/lol/' + req.params.region + '/v2.2/matchlist/by-summoner/'
          + summoner["id"] + key,
          function(error,response,body) {
            if(!error && response.statusCode == 200) {
              var matchlistInfo = JSON.parse(body);
              //Append Summoner Information to Matchlist Object
              matchlistInfo.summoner = summoner;
              //returns an array of previous matches
              res.json(matchlistInfo);
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
