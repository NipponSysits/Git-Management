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

// var criteria = db.criteriaFor("user");
var Users = db.meteorCollection("user", "mysql.user");

Meteor.publish("user_access", function(){
    return Users.find();
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



// WebApp.connectHandlers.use("/hello", function(req, res, next) {
//   res.writeHead(200);
//   res.end("Hello world from: " + Meteor.release);
// }); 