import { Meteor } from 'meteor/meteor';

const md5				= require('md5');
const config 		= require('$custom/config');
const db 				= Mysql.connect(config.mysql);

import './account';

// const liveDb 		= new LiveMysql(config.mysql);
Meteor.methods({
  AccountCreateUser: function (user) {
  	Accounts.createUser({ username: 'dvgamer', email: 'kem@ns.co.th', password: 'fd952516b77e1c3ca1a3dd46e0f60988' });
  	console.log('call createUser');
  }
});


console.log('METEOR_CONFIG', process.env.METEOR_CONFIG);

Meteor.publish('getDashboardProfile', function(username){
  // return liveDb.select(`SELECT * FROM user_access WHERE username='`+username+`'`, [{ 
  // 	table: 'user' 
  // }]);
  this.ready();
});


Users = db.meteorCollection("user", "usersCollection");

console.log(Users.find().fetch());
    //End of changes, that's it!


Meteor.publish("user_access", function(){
    return posts.find();
});




Meteor.startup(function() {

  Meteor.users.remove({}, function (error, result) {
    if (error) {
      console.log("Error removing user: ", error);
    } else {
      console.log("Number of users removed: " + result);
    }
  });
  console.log('users', Meteor.users.find().count());
  if (Meteor.users.find().count() === 0) {
  	// db.select('user_access', {}).then(function(user_access){
			// Meteor.Call('AccountCreateUser', user_access[0], function (error, result) { console.log(error, result); } );
  	// });
  }
});



// WebApp.connectHandlers.use("/hello", function(req, res, next) {
//   res.writeHead(200);
//   res.end("Hello world from: " + Meteor.release);
// }); 