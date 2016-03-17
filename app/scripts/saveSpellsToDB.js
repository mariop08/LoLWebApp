var mongoose = require('mongoose');
var request = require('request');
var config = require('../../config');
var Spell = require('../../models/spell');
var SpellsVersion = require('../../models/spellsVersion');

module.exports = {
	saveToDB: function() {
		request(
		  'https://global.api.pvp.net/api/lol/static-data/na/v1.2/summoner-spell' + config.LeagueAPI.key,
		  function(error,response,body) {
		  	var spellJSON = JSON.parse(body);
		  	SpellsVersion.findOne({type:'spellsVersion'}, function(err, dbVersion) {
		  		//if version info is not found
		  		if(!dbVersion || Object.keys(dbVersion).length == 0) {
		  			console.log('Version info not found. Updating the db..');
		  			updateSpellsDB(addSpellsVersion, addSpellsToDB, spellJSON);
		  		}		  		
		  		else {
		  			if(dbVersion.version === spellJSON["version"]) {
		  				console.log('Spells version up to date.');
		  				console.log('Current spells version number: '+dbVersion.version);
		  			}
		  			else {
		  				console.log('db version is outdated, updating..');
		  				updateSpellsDB(addSpellsVersion, addSpellsToDB, spellJSON);
		  			}
		  		}
		  	})
		 })
	}
}

function addSpellsToDB(spellJSON) {
	var spellObjs = spellJSON["data"]
	for(var spell in spellObjs) {
  		Spell.create(spellObjs[spell], function (err, res) {
			if (err) return handleError(err);
			// saved!
			console.log('Record for Spell:', res.name,"was created.");
			// console.log(res);
  		});
  	}
}

function addSpellsVersion(spellJSON) {
	SpellsVersion.create({
		type : "spellsVersion",
		version : spellJSON["version"], 
		date : new Date() 
	}, function(err, res) {
		console.log('version '+res.version+' created.');
		console.log(res);
	});
}

/*	Drops the Champions collection and calls the passed-in functions 
	to create champion documents and championsVersion document
*/
function updateSpellsDB(addSpellsVersionFunction, addSpellsFunction, spellJSON) {
	mongoose.connection.collections['Spells'].drop( function(err) {
		console.log('Dropping Spells collection and starting over..');
		addSpellsVersionFunction(spellJSON);
		addSpellsFunction(spellJSON);
	});
}

