"use strict";
var cds = require("sap-cds");

function getThingEntity(req, res, callback){
	
	function importCallback(error, entities) {
		if (error) {
			console.error(error);
		} else {
			var thing = entities["bgg.db::game.thing"];
			var category = entities["bgg.db::game.category"];
			callback(thing, category);
		}
	}	
	
	cds.$importEntities(
		[{ $entity: "bgg.db::game.thing"},{ $entity: "bgg.db::game.category"}],
		importCallback
	);
}

function getThingInstance(req, res, callback){
	
	getThingEntity(req, res, function(thingEntity, categoryEntity){
		function transactionCallback(err, tx) {
			tx.$get(thingEntity, { id: Number(req.params.thingId) }, callback);
		}		
		cds.$getTransaction(req.db, transactionCallback);
	});
}

function createThing(req, res){
	
	getThingEntity(req, res, function(thingEntity, categoryEntity){
		function transactionCallback(transError, tx) {
				tx.$save({$entity: thingEntity, 
					id: req.params.thingId, 
					name: req.params.name, 
					description: req.params.description, 
					thumbnail: req.params.thumbnail
				}, function(saveError, result){
					if(!saveError){
						tx.$close();
						res.type("application/json").status(200).send(JSON.stringify(result));
					}
					else{
						res.type("application/json").status(200).send(saveError);						
					}
				});
			}
		cds.$getTransaction(req.db, transactionCallback);
	});
}

function changeThing(req, res){
	
	getThingEntity(req, res, function(thingEntity, categoryEntity){
		
		function transactionCallback(transError, tx) {
			
			function getCallback(getError, thing){
				thing.description = req.params.newDescription;
				tx.$save(thing , function(saveError, instance){
					tx.$close();
					res.type("application/json").status(200).send(JSON.stringify(instance));
				});				
			}
			tx.$get(thingEntity, { id: Number(req.params.thingId) }, getCallback);
		}		
		cds.$getTransaction(req.db, transactionCallback);
	});
}

function getThingComplex(req, res){
	
	getThingEntity(req, res, function(thingEntity, categoryEntity){
		
		function transactionCallback(transError, tx) {
			var qThing = thingEntity.$query(tx).$project({
				description: true,
				name: true
			});
			var qSelectedThing = qThing.$where(thingEntity.name.$eq(req.params.thingName));
			qSelectedThing.$execute(function (error, results) {
				tx.$close();
				res.type("application/json").status(200).send(JSON.stringify(results));
			});
		}		
		cds.$getTransaction(req.db, transactionCallback);
	});
}

function getThingName(req, res){
	getThingInstance(req, res, function(error, instance){
		res.type("application/json").status(200).send(JSON.stringify(instance));
	});
}

module.exports.getThingName = getThingName;
module.exports.changeThing = changeThing;                    
module.exports.createThing = createThing;   
module.exports.getThingComplex = getThingComplex;
