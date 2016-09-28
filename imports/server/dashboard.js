import { Meteor } 	from 'meteor/meteor';

const config 		= require('$custom/config');
const mongo     = require('$custom/schema');
const mysql     = mongo.DB;
const socket    = require('$custom/sentinel').clent;
const exp 			= require('/imports/api/experience');

Meteor.publish('dashboard', function(username) {
  let self = this;
  let getUser = {}, calc = {};
  if(username) {
  	getUser = Meteor.users.findOne({ username: username });
  } else if(self.userId) {
  	getUser = Meteor.users.findOne({ _id: self.userId });
  } else {
  	self.stop();
    return [];
  }

  let user_id = getUser.profile.user_id;

  let getEmail = (Meteor.wrapAsync(function(callback) {
  	let where = { '_table':'user_email',  '_get.user_id': user_id }
		mysql.find(where, function(err, result){ 
			result = result.map(function(user){ return user._get.email; });
			callback(err, result);
		});
  }))();

  calc.logs = (Meteor.wrapAsync(function(callback) {
	  let commits = mongo.Commit.aggregate( [
	    { $match : { email : { '$in': getEmail }, logs: true } },
	    { $group : { 
	      _id : { commit_id : "$commit_id", email: "$email" }, 
	      alike: { $push: "$repository_id" }, 
	      count: { $sum: 1 } } 
	    }
	  ]);

    commits.exec(function(err, logs){ callback(err, logs.length); });
  }))();

  // { '_table':'repository', '_get.fork_id': {$ne:null} }
  let getCount = Meteor.wrapAsync(function(where, callback) {
    mysql.count(where, function(err, result){ callback(err, result); });
  });


	calc.fork = getCount({ '_table':'repository', '_get.created_id': user_id, '_get.fork_id': { $ne: null } });
	calc.created = getCount({ '_table':'repository', '_get.created_id': user_id, '_get.content_id': null, '_get.fork_id': null });
	calc.assist = getCount({ '_table':'repository_contributor', '_get.user_id': user_id, '_get.permission': 'Contributors' });
	calc.own = getCount({ '_table':'repository_contributor', '_get.user_id': user_id, '_get.permission': 'Administrators' });
//     let def = Q.defer();
//     let query = `
//       SELECT SUM(fork) fork, SUM(created) created, SUM(assist) assist, SUM(own) own 
//       FROM (

//         SELECT 0 fork, 0 created, COUNT(*) assist, 0 own FROM repository_contributor
//         WHERE user_id = ${user_id} AND permission = 'Contributors'

//         UNION ALL
//         SELECT 0 fork, 0 created, 0 assist, COUNT(*) own FROM repository_contributor
//         WHERE user_id = ${user_id} AND permission = 'Administrators'
//       ) s
//     `;

//     db.query(query, function(err, data){
//       if(err || data.length == 0) {
//         def.reject(err);
//       } else {
//         calc.fork = parseInt(data[0].fork);
//         calc.created = parseInt(data[0].created);
//         calc.assist = parseInt(data[0].assist);
//         calc.own = parseInt(data[0].own);
//         def.resolve();
//       }
//     });
//     return def.promise;
//   }).then(function(){
    let dashboard = exp(calc.logs + (calc.fork * 2) + (calc.assist * 3) + (calc.own * 4) + (calc.created * 5));
    dashboard.userId = getUser._id;
    dashboard.contributions = calc.logs;
    dashboard.fork = calc.fork;
    dashboard.repositories = calc.created;
    dashboard.assistant = calc.assist;
    dashboard.owner = calc.own;

    self.added('exp.dashboard', dashboard.userId, dashboard);
    self.ready();
});