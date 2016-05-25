import { Meteor } 	from 'meteor/meteor';

const config 		= require('$custom/config');
const db 				= Mysql.connect(config.mysql);

var dbRepository 						= db.meteorCollection("repository", "mysql.repository");
var dbRepositoryCollection 	= db.meteorCollection("repository_collection", "mysql.repository_collection");
var dbRepositoryContributor = db.meteorCollection("repository_contributor", "mysql.repository_contributor");

var monCollection = new Mongo.Collection("list.repository_collection");
var monRepository = new Mongo.Collection("list.repository");

Meteor.publish('collection-list', function() {
  // Meteor._sleepForMs(2000);
  let self = this;
  if(!self.userId) return [];

  let User = Meteor.users.findOne({ _id: self.userId }).profile;
  let query = "select * from repository_collection where user_id="+User.user_id;
  db.query(query, function(err, data){
  	if(err) self.error(err);
		(data || []).forEach(function(item){
  		self.added('list.repository_collection', item.collection_id, { collection_name: item.name, list: 1});
		});
		self.ready();
  });
});

Meteor.publish('repository-list', function(user_id, collection_id) {
  // Meteor._sleepForMs(2000);
  let self = this;
  if(self.userId) {
	  let User = Meteor.users.findOne({ _id: self.userId }).profile;
	  let query = "select * from repository where user_id="+User.user_id;
	  db.query(query, function(err, data){
	  	if(err) self.error(err);
  		(data || []).forEach(function(item){
	  		self.added('list.repository', item.collection_id, { collection_name: item.name, list: 1});
  		});
			self.ready();
	  });
  } else {
  	self.ready();
  }
});

// const liveDb 		= new LiveMysql(config.mysql);

Meteor.publish('getDashboardProfile', function(username){
  // return liveDb.select(`SELECT * FROM user_access WHERE username='`+username+`'`, [{ 
  // 	table: 'user' 
  // }]);
  this.ready();
});


// db.end(function(err) {
// 	console.log('The connection', err);
//   // The connection, table events and queries are terminated now
// });