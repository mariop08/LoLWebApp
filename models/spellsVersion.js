/**
 * Created by Alice on 3/16/2016
 * Super based on Mario's summoner.js file :D
 */

var mongoose = require('mongoose');
var SpellsVersionSchema = new mongoose.Schema({
	type: String,
  version: String,
  date: Date
},{collection: 'Spells'});

module.exports = mongoose.model('SpellsVersion', SpellsVersionSchema);
