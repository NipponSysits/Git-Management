import { Meteor } from 'meteor/meteor';
import './account';

console.log('METEOR_CONFIG', process.env.METEOR_CONFIG);

const config 		= require('$custom/config');
const liveDb 		= new LiveMysql(config.mysql);

Meteor.startup(() => {
  // code to run on server at startup
});

Meteor.publish('getDashboardProfile', function(username){
  return liveDb.select(`SELECT * FROM user_access WHERE username='`+username+`'`, [{ 
  	table: 'user' 
  }]);
});

// Close connections on hot code push
process.on('SIGTERM', function() { liveDb.end(); process.exit(); });
// Close connections on exit (ctrl + c)
process.on('SIGINT', function() { liveDb.end(); process.exit(); });