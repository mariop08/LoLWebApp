/**
 * Created by Mario on 2/3/2016.
 */

var mongoose = require('mongoose');
var SummonerSchema = mongoose.Schema({
  summonerid: Number,
  name: String,
  profileIconId: Number,
  revisionDate: Number,
  summonerLevel: Number
});

module.exports = mongoose.model('Summoner', SummonerSchema);
