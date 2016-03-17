var mongoose = require('mongoose');
var request = require('request');
var config = require('../../config');
var Champion = require('../../models/champion');
var ChampionsVersion = require('../../models/championsVersion');

module.exports = {
	saveToDB: function() {
		request(
		  'https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion' + config.LeagueAPI.key,
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
		  				}
		  				/*	comparing the number of champions recorded in the championsVersion document 
		  					with the number of champions object from JSON returned by riot's api
		  				*/
		  				else if(dbVersion.numberOfChampions !== Object.keys(championJSON["data"]).length) {
			  				console.log('numberOfChampions variable in ChampionsVersion is different from '
			  				+ 'the number of champions in the JSON, updating the db..');
			  				updateChampionsDB(addChampionsVersion, addChampionsToDB, championJSON);
			  			}
			  			//if version number is same, db doesn't need to be updated
			  			else if(dbVersion.version === championJSON["version"]) {
			  				console.log('Champions version up to date.');
			  				console.log('Current champions version number: '+dbVersion.version);
			  				console.log('Total ' + dbVersion.numberOfChampions + ' champions in db');
			  			}
			  			else if(dbVersion.version !== championJSON["version"]){
				  			console.log('db version is outdated, updating..');
				  			updateChampionsDB(addChampionsVersion, addChampionsToDB, championJSON);
			  			}
			  			else {
			  				console.log('updating db..');
			  				updateChampionsDB(addChampionsVersion, addChampionsToDB, championJSON);
			  			}
		  			})
		  		}
		  	})
		 })
	}
}

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

