"use strict";
var cds = require("sap-cds");

function getProductEntity(req, res, callback){
	
	function importCallback(error, entities) {
		if (error) {
			console.error(error);
		} else {
			var product = entities["bgg.db::game.product"];
			var category = entities["bgg.db::game.category"];
			callback(product, category);
		}
	}	
	
	cds.$importEntities(
		[{ $entity: "bgg.db::game.product", $fields: { categories: { $association: { $lazy: true } } } },{ $entity: "bgg.db::game.category", $fields: { products: { $association: { $lazy: true } } } }],
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

function createProduct(req, res){
	
	getProductEntity(req, res, function(productEntity, categoryEntity){
		function transactionCallback(transError, tx) {
			    tx.$find(categoryEntity, { name: "cat 1" }, function (findError, cats) {
        			var cat1 = cats[0] || null;
        			if(cat1 == null){
        				res.type("application/json").status(200).send("no cat");
        			}
				tx.$save({$entity: productEntity, 
					id: req.params.productId, 
					name: req.params.name, 
					description: req.params.description, 
					thumbnail: req.params.thumbnail,
					categories: [cat1]
				}, function(saveError, result){
					if(!saveError){
						tx.$close();
						res.type("application/json").status(200).send(JSON.stringify(result));
					}
					else{
						res.type("application/json").status(200).send(JSON.stringify(cat1));						
					}
				});
			});
		}		
		cds.$getTransaction(req.db, transactionCallback);
	});
}

function changeProduct(req, res){
	
	getProductEntity(req, res, function(productEntity, categoryEntity){
		
		function transactionCallback(transError, tx) {
			
			function getCallback(getError, product){
				product.description = req.params.newDescription;
				tx.$save(product, function(saveError, instance){
					tx.$close();
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
module.exports.createProduct = createProduct;   
