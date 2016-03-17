/**
 * Created by Alice on 3/16/2016
 * Super based on Mario's summoner.js file :D
 */

var mongoose = require('mongoose');
var ChampionsVersionSchema = new mongoose.Schema({
	type: String,
  version: String,
  date: Date,
  numberOfChampions: Number,
},{collection: 'Champions'});

module.exports = mongoose.model('ChampionsVersion', ChampionsVersionSchema);
