import { Meteor } from 'meteor/meteor';

const md5				= require('md5');
const config 		= require('$custom/config');
const db 				= Mysql.connect(config.mysql);

import './account';

console.log('METEOR_CONFIG', process.env.METEOR_CONFIG);

var Users = db.meteorCollection("user", "mysql.user");

var Repos = new Mongo.Collection("repositories");

Meteor.startup(function () {
	console.log('repositories insert');
  Repos.insert({
    collection_name: 'dvgamer',
    collection_id: null,
    user_id: 1,
    list: 33
  });
  Repos.insert({
    collection_name: 'ATTA',
    collection_id: 4,
    user_id: null,
    list: 4
  });
  Repos.insert({
    collection_name: 'check-stock',
    collection_id: 6,
    user_id: null,
    list: 6
  });

  Meteor.users.remove({}, function (error, result) {
    if (error) {
      console.log("Error removing user: ", error);
    } else {
      console.log("Number of users removed: " + result);
    }
  });
  console.log('users', Meteor.users.find().count());
  if (Meteor.users.find().count() === 0) {
  	Users.find().fetch().forEach(function(user){
  		Accounts.createUser({ 
  			username: user.username, 
  			email: user.email, 
  			password: user.password,
  			profile: { 
  				email: user.email,
  				userId: user.userId,
  				fullname: user.name+(user.surname?' '+user.surname:''),
  				position: user.position,
  				roleId: user.roleId,
  				attended: user.attended
  			}
  		});
  	});
  	console.log('created', Meteor.users.find().count());
  }

});

// publish Repos
Meteor.publish('collection', function(user_id) {
  Meteor._sleepForMs(2000);
  return Repos.find();
});

Meteor.publish("user_access", function(){
    return Users.find();
});

// const liveDb 		= new LiveMysql(config.mysql);

Meteor.publish('getDashboardProfile', function(username){
  // return liveDb.select(`SELECT * FROM user_access WHERE username='`+username+`'`, [{ 
  // 	table: 'user' 
  // }]);
  this.ready();
});


// select count(r.user_id) list, u.username collection_name, NULL collection_id, r.user_id 
// from repository r
// left join user u ON u.user_id = r.user_id
// where r.user_id is not null and r.anonymous = 'YES' or u.user_id = 1 
// group by u.username, r.user_id
// union all
// select count(p.collection_id) list, p.name collection_name, p.collection_id, NULL user_id
// from repository r
// left join repository_collection p ON r.collection_id = p.collection_id
// where r.collection_id is not null
// group by p.name, p.collection_id;