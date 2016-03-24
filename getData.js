var mongoose = require('mongoose');
var express = require('express');

var bodyParser = require('body-parser');
var Summoner = require('./models/summoner');


//Provides functions for saving champions/spells static data to db
var saveChampToDB = require('./app/scripts/saveChampionsToDB');
var saveSpellToDB = require('./app/scripts/saveSpellsToDB');

mongoose.connect('mongodb://localhost/leagueApp');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log("Connected to MongoDB");
});

saveChampToDB.saveToDB();
saveSpellToDB.saveToDB();
