var mongoose = require('mongoose');
var express = require('express');

var bodyParser = require('body-parser');
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

var app = express();

app.set('view engine', 'jade');

app.use(express.static(__dirname + '/app'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var port = process.env.PORT || 8082;

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
