import { Meteor } from 'meteor/meteor';

const config 		= require('$custom/config');
const db 				= Mysql.connect(config.mysql);

console.log('METEOR_CONFIG', process.env.METEOR_CONFIG);

var dbUser 									= db.meteorCollection("user", "mysql.user");
var dbRole 									= db.meteorCollection("role", "mysql.role");

Meteor.startup(function () {

  Meteor.users.remove({}, function (error, result) {
    if (error) {
      console.log("Error removing user: ", error);
    }
  });

  // Created User
	dbUser.find().forEach(function(user){
		let role = dbRole.findOne({ roleId : user.roleId });

		Accounts.createUser({ 
			username: user.username, 
			email: user.email, 
			password: user.password,
			profile: { 
				email: user.email,
				user_id: user.userId,
				fullname: user.name+(user.surname?' '+user.surname:''),
				position: user.position,
				role: role,
				attended: user.attended
			}
		});
	});

});

process.on("SIGTERM", function() {
  db.end(function(){
  	db.destroy();
  });
});

process.on("SIGINT", function() {
  db.end(function(){
  	db.destroy();
  });
});