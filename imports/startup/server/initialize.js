
import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';

const Q         = require('q');
const fs 				= require('fs');
const md5       = require('md5');
const request 	= require('request');
const config 		= require('$custom/config');
const mongo     = require('$custom/schema');
const db 				= Mysql.connect(config.mysql);


console.log('meteor-config', config.arg);



Meteor.methods({
  reqGravatar: function (size, id) {

  }
});

Meteor.startup(function () {
  let UserItem = [], UserAccount = [], isSuccess = false;
	(function(){
    let def = Q.defer();

		let getProfile = function(user) {
			let account = {
				username: user.username,
				email: null,
				password: user.password,
			}
			let profile = {
				status: user.status == 'ON' ? true : false,
				user_id: user.user_id,
				email: [],
				fullname: user.name + (user.surname ? ' ' + user.surname:''),
				position: user.position,
				level: user.level,
				role: {
					name: user.role_name,
					description: user.role_description
				},
				attended: user.attended,
				quit: user.quit,
			}

			return (function(){
  			let def = Q.defer();
	    	db.query(`SELECT email, \`primary\` FROM user_email WHERE user_id = ${user.user_id} AND \`status\` = 'ACTIVE'`, function(err, data){
		      if(err || data.length == 0) { def.resolve([]); } else { def.resolve(data); }
		    });
  			return def.promise;
    	})().then(function(data){ 
    		// let download = []
      	data.forEach(function(item) {
      		profile.email.push(item.email);
      		if(item.primary === 'YES') {
            account.email = item.email;
            profile.primary = item.email;
      			profile.gravatar = `${md5(item.email)}.jpg`;
      		}
      	});
      	account.profile = profile;
      	UserAccount.push(account);
    	});
		}

    let query = `
      SELECT 
      	r.name role_name, r.description role_description, r.level, 
      	u.user_id, u.name, u.surname, u.username, 
      	u.password, u.position, u.attended, u.quit, u.status
      FROM user u
      INNER JOIN role r ON u.role_id = r.role_id
    `;	   
    db.query(query, function(err, data){
      if(err || data.length == 0) {
      	def.reject(err);
      } else {
      	data.forEach(function(user) {
      		UserItem.push(getProfile(user))
      	});
      	def.resolve();
      }
    });
    return def.promise;
  })().then(function(){
    return Q.all(UserItem);
  }).then(function(){
  	console.log('Accounts.Created', true);
  	isSuccess = true;
  }).catch(function(ex){
  	console.log('Accounts.Created', ex);
  });


  var idCreated = Meteor.setInterval(function(){
  	// Meteor.clearInterval(id)
  	if(isSuccess) {
  		isSuccess = false;
  		Meteor.clearInterval(idCreated);

  		// Meteor.users.remove({}, function (error, result) {
		  //   if (error) { console.log("Error removing user: ", error); }

	  	// 	UserAccount.forEach(function(account) {
	  	// 		Accounts.createUser(account);
	  	// 	});

	  	// });

  	}
  }, 500);
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