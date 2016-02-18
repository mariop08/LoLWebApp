/**
 * Created by Mario on 2/3/2016.
 */

var mongoose = require('mongoose');
var SummonerSchema = new mongoose.Schema({
  id: Number,
  name: String,
  profileIconId: Number,
  summonerLevel: Number,
  revisionDate: Number,
  altname: String
},{collection: 'Summoner'});

module.exports = mongoose.model('Summoner', SummonerSchema);
