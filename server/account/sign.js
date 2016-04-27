import { Meteor } 	from 'meteor/meteor';

const config 		= require('$custom/config');
const db 				= require('$custom/mysql').connect();

const liveDb 		= new LiveMysql(Meteor.settings.mysql);

Meteor.publish('allPlayers', function(supplierid){
  return liveDb.select(`SELECT * FROM user where username ='dvgamer' LIMIT 1`, [{ 
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