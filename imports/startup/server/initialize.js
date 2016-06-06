import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';

const config 		= require('$custom/config');
const db 				= Mysql.connect(config.mysql);

console.log('config', config.arg);

var dbUser = db.meteorCollection("user", "mysql.user");
var dbRole = db.meteorCollection("role", "mysql.role");

Meteor.startup(function () {

  // Meteor.users.remove({}, function (error, result) {
  //   if (error) { console.log("Error removing user: ", error); }

		// dbUser.find().forEach(function(user){
		// 	let role = dbRole.findOne({ roleId : user.roleId });

		// 	Accounts.createUser({ 
		// 		username: user.username, 
		// 		email: user.signId, 
		// 		password: user.password,
		// 		profile: {
		// 			status: user.status == 'ON' ? true : false,
		// 			user_id: user.userId,
		// 			email: user.signId,
		// 			fullname: user.name+(user.surname?' '+user.surname:''),
		// 			position: user.position,
		// 			role: role,
		// 			attended: user.attended
		// 		}
		// 	});
		// });
  // });

});

process.on("SIGTERM", function() {
  console.log("SIGTERM END");
  db.end();
	db.destroy();
});

process.on("SIGINT", function() {
  console.log("SIGINT END");
  db.end();
	db.destroy();
});