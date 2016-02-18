var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/leagueApp');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log("Connected to MongoDB");
});

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
router.route('/api/matchlist/:summonername/:region')

  .get(function(req,res){
    var sname = req.params.summonername;
    Summoner.findOne({name: sname},'-_id id name profileIconId summonerLevel revisionDate', function(err, summoner) {
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
        console.log("Summmoner record found in DB: ", summoner, "\n");
        console.log(https + req.params.region + '.api.pvp.net/api/lol/' + req.params.region + '/v2.2/matchlist/by-summoner/'
        + summoner["id"]+ key);
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

//Gets Recent Game Object
router.route('/api/recentgame/:summonername/:region')
    .get(function(req,res){
      var sname = req.params.summonername;
      Summoner.findOne({name: sname},'-_id id name profileIconId summonerLevel revisionDate', function(err, summoner) {
        //console.log(summoner);
        if(err)
          res.send(err);
        else if(!summoner){
          console.log('Summoner not found in DB, calling API');
          console.log(https + req.params.region + '.api.pvp.net/api/lol/' + req.params.region + '/v1.4/summoner/by-name/'
            + sname + key);
          request(
            https + req.params.region + '.api.pvp.net/api/lol/' + req.params.region + '/v1.4/summoner/by-name/'
            + sname + key,
            function(error,response,body) {
              if(!error && response.statusCode == 200) {
                //If the summoner name has a space in it, such as 'Ah Som', summonerInfo object will look like the following:
                //{"ahsom":{"id":....}}
                //In this case, calling summonerInfo["Ah Som"] will throw an error, so I'm setting summonerKey to "ahsom"
                //and using summonerKey("ahsom") instead of sname("Ah Som") to access the summonerInfo object
                var summonerInfo = JSON.parse(body),
                  summonerKey;
                for(name in summonerInfo)
                  summonerKey = name;
                var summonerId = summonerInfo[summonerKey].id;

                //Add Create Summoner Record in DB
                Summoner.create(summonerInfo, function (err, res) {
                  if (err) return handleError(err);
                  // saved!
                  console.log('Record for Summoner:', summonerInfo[summonerKey].name," was created.");
                });

                //Call get recentgame api
                request(
                  https + req.params.region + '.api.pvp.net/api/lol/' + req.params.region + '/v1.3/game/by-summoner/'
                + summonerId + '/recent' + key,
                  function(error,response,body) {
                    if(!error && response.statusCode == 200) {
                      var recentGameInfo = JSON.parse(body);
                      //append summoner info
                      recentGameInfo.summonerInfo = summonerInfo[summonerKey];
                      //returns an array of 1o recent matches
                      res.json(recentGameInfo);
                    }
                    else {
                      //print error message
                      res.send("ERROR! ", response.statusCode);

                    }
                  });
              }
              else {
                console.log(response.statusCode);
                res.send("ERROR: ", response.statusCode);
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
                res.send("ERROR... ", response.statusCode);
              }
            });
        }
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
console.log('The server is running at port: ' + port);
