var mongoose = require('mongoose');
var express = require('express');
var bodyParser = require('body-parser');

//Summoner model for manipulating summoner data
var Summoner = require('./models/summoner');
var request = require('request');

//Import Configuration Specifics
var config = require('./config');

//Provides route for Angular Web App
var main = require('./routes/main')

//Provides routes for the current available API
var recent = require('./routes/recentgame');
var matchlist = require('./routes/matchlist');
var match = require('./routes/match');

//Provides functions for saving champions/spells static data to db
var saveChampToDB = require('./app/scripts/saveChampionsToDB');
var saveSpellToDB = require('./app/scripts/saveSpellsToDB');

//Provides cron-like scheduling functions for running db updates
var schedule = require('node-schedule');

var app = express();

//Set HTML engine
app.set('view engine', 'jade');

//Set app static directory & bower component window
app.use(express.static(__dirname + '/app'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var port = process.env.PORT || config.port.dev;

var router = express.Router();

app.use('/', main);
app.use('/api/recentgame', recent);
app.use('/api/matchlist', matchlist);
app.use('/api/match', match);
app.use('/', router);

mongoose.connect('mongodb://localhost/leagueApp');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log("Connected to MongoDB");
});

app.listen(port);
console.log('The server is running at port: ' + port);


//runs every day at midnight, 0:0:0 
var update = schedule.scheduleJob('0 0 0 * * *', function(){
	console.log("Checking for update on " + new Date());
	//Calls the riot api for champions static data and saves the data to db
	saveChampToDB.saveToDB();
	saveSpellToDB.saveToDB();
});