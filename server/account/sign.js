import { Meteor } 	from 'meteor/meteor';

const config 		= require('$custom/config');
const liveDb 		= new LiveMysql(config.mysql);

Meteor.publish('user-verify', function(auth){
	let query = `SELECT a.* , u.password FROM user u JOIN user_access a ON a.user_id = u.user_id `;
	let where = `WHERE u.email='`+auth.email+`' and u.status='ON' LIMIT 1`;

  return liveDb.select(query+where, [{ 
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

// Close connections on hot code push
process.on('SIGTERM', function() { liveDb.end(); process.exit(); });
// Close connections on exit (ctrl + c)
process.on('SIGINT', function() { liveDb.end(); process.exit(); });