var mongoose = require('mongoose');
var express = require('express');
var config = require('../config');

var https = 'https://';
var key = config.LeagueAPI.key;
var Summoner = require('../models/summoner');
var request = require('request');

var router = express.Router();

//Gets Match Object
//matchid: Identifies match object that is requested
//region: Region of summoner must be provided for now, consider cookie or session variable to store
router.route('/:matchid/:region')

    .get(function(req,res){
          console.log(https + req.params.region + '.api.pvp.net/api/lol/' + req.params.region + '/v2.2/match/'
          + req.params.matchid + key);
          request(
            https + req.params.region + '.api.pvp.net/api/lol/' + req.params.region + '/v2.2/match/'
            + req.params.matchid + key,
            function(error,response,body) {
              if(!error && response.statusCode == 200) {
                console.log("Match Information was successfully retrieved");
                res.send(body);
            }
      });
});

module.exports = router;
