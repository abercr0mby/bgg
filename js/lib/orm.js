"use strict";
var cds = require("sap-cds");

function getProduct(req, res){
	cds.$importEntities([
		{ $entity: "bgg.db::game.product" },
		{ $entity: "bgg.db::game.category" }
	], function main(error, entities) {
		if (error) {
			console.error(error);
		} else {
			var product = entities["bgg.db::game.product"];
			var category = entities["bgg.db::game.category"];

			cds.$getTransaction(req.db, cb);
		}
		
		function cb(err, tx) {
			tx.$get(product, { id: Number(req.params.productId) }, function(error2, instance) {
				res.type("application/json").status(200).send(instance.name);
			});
		}		
		
	});                         
}



module.exports.getProduct = getProduct;