import { Meteor } 	from 'meteor/meteor';

const config 		= require('$custom/config');
const liveDb 		= new LiveMysql(config.mysql);

Meteor.publish('user-verify', function(auth){
  return liveDb.select(`SELECT username, password, CONCAT(name, ' ',surname) fullname FROM user WHERE email='`+auth.email+`' and status='ON' LIMIT 1`, [{ 
  	table: 'user' 
  }]);
});

Meteor.publish('user-access', function(auth){
  return liveDb.select(`SELECT * FROM user_access WHERE username='`+auth.email+`'`, [{ 
  	table: 'user' 
  }]);
});





// Meteor.publish('sign-in', function(){
// 	let self = this;
//   db.query('select * from user', {}).then(function(a){
//   	console.log(a[0]);
// 		Meteor.methods({
// 			'bar': function () {
// 	    // .. do other stuff ..
// 	    return a[0];
// 	  }});

//   	self.ready();
//   }).catch(function(ex){
//   	console.log(ex);
//   	self.error();
//   });
// 	return;
// });


// Meteor.methods({
//   sign: function (arg1, arg2) {
//     return db.query('select * from user', {});
//   }
// });