/**
 * Created by Alice on 3/15/2016
 * Super based on Mario's summoner.js file :D
 */

var mongoose = require('mongoose');
var SpellSchema = new mongoose.Schema({
  id: Number,
  description: String,
  name: String,
  key: String,
  summonerLevel: Number
},{collection: 'Spells'});

module.exports = mongoose.model('Spell', SpellSchema);
