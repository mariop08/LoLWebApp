var mongoose = require('mongoose');
var express = require('express');
var config = require('../config');

var https = 'https://';
var key = config.LeagueAPI.key;
var Champion = require('../models/champion');
var ChampionsVersion = require('../models/championsVersion');
var request = require('request');

var router = express.Router();


function addChampionsToDB(championJSON) {
	var championObjs = championJSON["data"]
	for(var champ in championObjs) {
  		Champion.create(championObjs[champ], function (err, res) {
			if (err) return handleError(err);
			// saved!
			console.log('Record for Champion:', res.name,"was created.");
			// console.log(res);
  		});
  	}
}

function addChampionsVersion(championJSON) {
	ChampionsVersion.create({
		type : "championsVersion",
		version : championJSON["version"], 
		date : new Date(), 
		numberOfChampions : Object.keys(championJSON["data"]).length
	}, function(err, res) {
		console.log('version '+res.version+' created.');
		console.log(res);
	});
}

/*	Drops the Champions collection and calls the passed-in functions 
	to create champion documents and championsVersion document
*/
function updateChampionsDB(addChampionsVersionFunction, addChampionsFunction, championJSON) {
	mongoose.connection.collections['Champions'].drop( function(err) {
		console.log('Dropping Champions collection and starting over..');
		addChampionsVersionFunction(championJSON);
		addChampionsFunction(championJSON);
	});
}

router.route('/:region')
	.get(function(req, res) {
		request(
		  https + 'global.api.pvp.net/api/lol/static-data/' + req.params.region + '/v1.2/champion' + key,
		  function(error,response,body) {
		  	var championJSON = JSON.parse(body);
		  	ChampionsVersion.findOne({type:'championsVersion'}, function(err, dbVersion) {
		  		//if version info is not found
		  		if(!dbVersion || Object.keys(dbVersion).length == 0) {
		  			console.log('Version info not found. Updating the db..');
		  			updateChampionsDB(addChampionsVersion, addChampionsToDB, championJSON);
		  		}		  		
		  		else {
		  			Champion.count(function(err, dbCount) {
		  				/*	comparing the number of champions recorded in the championsVersion document 
		  					with the actual number of champion documents in the Champions collection
		  					one of the documents in Champions collection is the versionInfo so dbCount - 1 */
		  				if(dbVersion.numberOfChampions !== dbCount-1) {
		  					console.log('Number of documents in Champions collection is different from '
		  					+ 'numberOfChampions variable in ChampionsVersion, updating the db..');	
		  					updateChampionsDB(addChampionsVersion, addChampionsToDB, championJSON);
		  					return;
		  				}
		  				/*	comparing the number of champions recorded in the championsVersion document 
		  					with the number of champions object from JSON returned by riot's api
		  				*/
		  				if(dbVersion.numberOfChampions !== Object.keys(championJSON["data"]).length) {
			  				console.log('numberOfChampions variable in ChampionsVersion is different from '
			  				+ 'the number of champions in the JSON, updating the db..');
			  				updateChampionsDB(addChampionsVersion, addChampionsToDB, championJSON);
			  				return;
			  			}
			  			/*	comparing the version number recorded in the championsVersion document
			  				with the version number from JSON returned by riot's api
			  			*/
			  			if(dbVersion.version !== championJSON["version"]) {
			  				console.log('db version is outdated, updating..');
			  				updateChampionsDB(addChampionsVersion, addChampionsToDB, championJSON);
			  				return;
			  			}
  			  			//if version number is same, db doesn't need to be updated
  			  			if(dbVersion.version == championJSON["version"]) {
  				  			console.log('Version up to date.');
  				  			console.log('Current version number: '+dbVersion.version);
  				  			console.log('Total ' + dbVersion.numberOfChampions + ' champions in db');
  			  			}
		  			})
		  		}
		  	})
		  	res.json(JSON.parse(body));
		 })
	});

module.exports = router;