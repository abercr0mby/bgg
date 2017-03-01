"use strict";
var cds = require("sap-cds");

function getProductEntity(req, res, callback){
	
	function importCallback(error, entities) {
		if (error) {
			console.error(error);
		} else {
			var product = entities["bgg.db::game.product"];
			var category = entities["bgg.db::game.category"];
			callback(product);
		}
	}	
	
	cds.$importEntities(
		[{ $entity: "bgg.db::game.product", $fields: { categories: { $association: { $lazy: true } } } },{ $entity: "bgg.db::game.category" }],
		importCallback
	);
}

function getProductInstance(req, res, callback){
	
	getProductEntity(req, res, function(product){
		function transactionCallback(err, tx) {
			tx.$get(product, { id: Number(req.params.productId) }, callback);
		}		
		cds.$getTransaction(req.db, transactionCallback);
	});
}

function changeProduct(req, res){
	
	getProductEntity(req, res, function(productEntity){
		
		function transactionCallback(transError, tx) {
			
			function getCallback(getError, product){
				product.description = req.params.newDescription;
				tx.$save(product, function(saveError, instance){
					res.type("application/json").status(200).send(JSON.stringify(instance));
				});				
			}
			tx.$get(productEntity, { id: Number(req.params.productId) }, getCallback);
		}		
		cds.$getTransaction(req.db, transactionCallback);
	});
}

function getProductName(req, res){
	getProductInstance(req, res, function(error, instance){
		res.type("application/json").status(200).send(JSON.stringify(instance));
	});
}

module.exports.getProductName = getProductName;
module.exports.changeProduct = changeProduct;                    
