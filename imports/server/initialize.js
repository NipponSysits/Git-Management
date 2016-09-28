
import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';

const Q         = require('q');
const fs 				= require('fs');
const md5       = require('md5');
const request 	= require('request');
const config 		= require('$custom/config');
const mysql     = require('$custom/schema').DB;

// const db 				= Mysql.connect(config.mysql);

console.log('meteor-config', config.arg);

var getMysql = Meteor.wrapAsync(function(where, callback) {
	mysql.find(where, function(err, result){ callback(err, result) });
});

var getOneMysql = Meteor.wrapAsync(function(where, callback) {
	mysql.findOne(where, function(err, result){ callback(err, result) });
});

var removeAllUser = Meteor.wrapAsync(function(callback) {
	Meteor.users.remove({}, function (err, result) { callback(err, result) });
});

// removeAllUser();
// getMysql({ '_table':'user', '_get.status':'ON'}).forEach(function (user) {
// 	user = user._get;
// 	let profile = {
// 		status: user.status == 'ON' ? true : false,
// 		user_id: user.user_id,
// 		email: null,
// 		fullname: user.name + (user.surname ? ' ' + user.surname:''),
// 		position: user.position,
// 		level: user.level,
// 		role: {
// 			name: user.role_name,
// 			description: user.role_description
// 		},
// 		attended: user.attended,
// 		quit: user.quit,
// 	}
// 	var getEmail = getOneMysql({ '_table':'user_email', '_get.primary':'YES', '_get.user_id': user.user_id });

// 	profile.email = getEmail._get.email;
// 	profile.gravatar = md5(getEmail._get.email);
// 	Accounts.createUser({
// 		username: user.username,
// 		email: getEmail._get.email,
// 		password: user.password,
// 		profile: profile
// 	});
// });





Meteor.startup(function () {


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