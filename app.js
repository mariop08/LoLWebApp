var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/summoner');

var express = require('express');

var bodyParser = require('body-parser');
var Summoner = require('./models/summoner');
var request = require('request');

////Imnportant KEY //////////////////////////////////////////////
var https = 'https://';
var key = '?api_key=29993728-af63-4ecd-84d8-fdd068d9d11a';

////////////////////////////////////////////////////////////////

var app = express();

app.set('view engine', 'jade');

app.use(express.static(__dirname + '/app'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var port = process.env.PORT || 8082;

var router = express.Router();

router.get('/', function(req,res){
  res.sendFile('index.html',{root: __dirname });
});

//Gets Summoner ID from either DB or API
//summonername: Summoner name which will be used to find ID
//region: Region of summoner, must be provided for now, consider cookie or session variable to store
router.route('/matchlist/:summonername/:region')

  .get(function(req,res){
    var sname = req.params.summonername;
    Summoner.findOne({name: sname}, function(err, summoner) {
      console.log(req.params);
      if(err)
        res.send(err);
      else if(!summoner){
        request(
          https + req.params.region + '.api.pvp.net/api/lol/' + req.params.region + '/v1.4/summoner/by-name/'
          + sname + key,
          function(error,response,body) {
            if(!error && response.statusCode == 200) {
              var summonerInfo = JSON.parse(body);
              var summonerId = summonerInfo[sname].id;

              //Add Create Summoner Record in DB

              //call get matchlist api
              //https://na.api.pvp.net/api/lol/na/v2.2/matchlist/by-summoner/27930921?api_key=####
              request(
                https + req.params.region + '.api.pvp.net/api/lol/' + req.params.region + '/v2.2/matchlist/by-summoner/'
                + summonerId + key,
                function(error,response,body) {
                  if(!error && response.statusCode == 200) {
                    var matchlistInfo = JSON.parse(body);
                    matchlistInfo.summoner = summonerInfo[sname];
                    //matchlistInfor.matches.id = summonerId;
                    console.log("First match: ", matchlistInfo.matches[0]);
                    console.log("Summoner Info: ", summonerInfo[sname]);
                    //returns an array of previous matches
                    res.json(matchlistInfo);
                  }
                  else {
                    //print error message
                  }
                });
            }
            else {
              res.send("ERROR: ", response.statusCode);
            }
        });
      }
      //If Summoner ID is found in the DB
      //else{}
    });
  });

//Gets Match Object
//matchid: Identifies match object that is requested
//region: Region of summoner must be provided for now, consider cookie or session variable to store
router.route('/api/match/:matchid/:region')

    .get(function(req,res){
          console.log(https + req.params.region + '.api.pvp.net/api/lol/' + req.params.region + '/v2.2/match/'
          + req.params.matchid + key);
          request(
            https + req.params.region + '.api.pvp.net/api/lol/' + req.params.region + '/v2.2/match/'
            + req.params.matchid + key,
            function(error,response,body) {
              if(!error && response.statusCode == 200) {
                console.log(body);
                res.send(body);
              }
          });
      });

app.use('/', router);

app.listen(port);
console.log('The shit at port ' + port);
