/**
 * Created by Alice on 3/15/2016
 * Super based on Mario's summoner.js file :D
 */

var mongoose = require('mongoose');
var ChampionSchema = new mongoose.Schema({
  id: Number,
  title: String,
  name: String,
  key: String
},{collection: 'Champions'});

module.exports = mongoose.model('Champion', ChampionSchema);
