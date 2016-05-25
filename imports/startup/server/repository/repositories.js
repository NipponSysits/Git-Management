import { Meteor } 	from 'meteor/meteor';

const config 		= require('$custom/config');
const db 				= Mysql.connect(config.mysql);

var monCollection = new Mongo.Collection("list.repository_collection");
var monRepository = new Mongo.Collection("list.repository");

Meteor.publish('collection-list', function() {
  // Meteor._sleepForMs(2000);
  let self = this;
  if(!self.userId) return [];

  let User = Meteor.users.findOne({ _id: self.userId }).profile;

  let query = `
  SELECT count(r.user_id) list, u.username collection_name, NULL collection_id, r.user_id 
  FROM repository r
  LEFT JOIN user u ON u.user_id = r.user_id
  WHERE r.collection_id is null 
  ${User.role.level > 1 ? `and r.anonymous = 'YES' or u.user_id = ${User.user_id}` : ``}
  GROUP BY u.username, r.user_id
  UNION ALL
  SELECT count(p.collection_id) list, p.name collection_name, p.collection_id, NULL user_id
  FROM repository r
  LEFT JOIN repository_collection p ON r.collection_id = p.collection_id
  LEFT JOIN repository_contributor c ON c.repository_id = r.repository_id
  WHERE r.collection_id is not null 
  ${User.role.level > 1 ? `and c.permission in ('Contributors','Administrators') and c.user_id = ${User.user_id}` : ``}
  GROUP BY p.name, p.collection_id;
  `;

  db.query(query, function(err, data){
  	if(err) self.error(err);
		(data || []).forEach(function(item){
      if((item.list > 0 && item.collection_id) || item.user_id) {
        self.added('list.repository_collection', item.collection_id ? 'c-'+item.collection_id : 'u-'+item.user_id, item);
      }
		});
		self.ready();
  });
});

Meteor.publish('repository-list', function(collection_id, user_id) {
  // Meteor._sleepForMs(2000);

  let self = this;
  if(!self.userId) return [];

  let User = Meteor.users.findOne({ _id: self.userId }).profile;
  let query = `
  SELECT * FROM repository WHERE collection_id=${collection_id} or user_id=${user_id}
  `;

  db.query(query, function(err, data){
  	if(err) self.error(err);
		(data || []).forEach(function(item){
  		self.added('list.repository', item.repository_id, item);
		});
		self.ready();
  });
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