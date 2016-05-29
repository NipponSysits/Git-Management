import './repositories.js';

dbListCollectionName = new Mongo.Collection("list.collection-name");
dbListCollectionUser = new Mongo.Collection("list.collection-user");
dbListRepository = new Mongo.Collection("list.repository");


dbListCollectionName.allow({
	insert: function(){ return true; },
	remove: function(){ return false; },
	update: function(){ return false; },
});