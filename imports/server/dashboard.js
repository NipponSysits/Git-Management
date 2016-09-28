import { Meteor } 	from 'meteor/meteor';

const config 		= require('$custom/config');
const mongo     = require('$custom/schema');
// const mysql     = mongo.DB;
const socket    = require('$custom/sentinel').clent;
const exp 			= require('/imports/api/experience');

Meteor.publish('dashboard-exp', function(username) {
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

  // let user_id = getUser.profile.user_id;

  // let getEmail = (Meteor.wrapAsync(function(callback) {
  //   let where = { '_table':'user_email',  '_get.user_id': user_id }
  //   mysql.find(where, function(err, result){ 
  //     result = result.map(function(user){ return user._get.email; });
  //     callback(err, result);
  //   });
  // }))();

  // console.time('logs ');
  // calc.logs = (Meteor.wrapAsync(function(callback) {
  //   let commits = mongo.Commit.aggregate( [
  //     { $match : { email : { '$in': getEmail }, logs: true } },
  //     { $group : { 
  //       _id : { commit_id : "$commit_id", email: "$email" }, 
  //       alike: { $push: "$repository_id" }, 
  //       count: { $sum: 1 } } 
  //     }
  //   ]);

  //   commits.exec(function(err, logs){ callback(err, logs.length); });
  // }))();
  // console.timeEnd('logs ');

  // let getCount = Meteor.wrapAsync(function(where, callback) {
  //   mysql.count(where, function(err, result){ callback(err, result); });
  // });

  // console.time('stats');
  // calc.fork = getCount({ '_table':'repository', '_get.created_id': user_id, '_get.fork_id': { $ne: null } });
  // calc.created = getCount({ '_table':'repository', '_get.created_id': user_id, '_get.content_id': null, '_get.fork_id': null });
  // calc.assist = getCount({ '_table':'repository_contributor', '_get.user_id': user_id, '_get.permission': 'Contributors' });
  // calc.own = getCount({ '_table':'repository_contributor', '_get.user_id': user_id, '_get.permission': 'Administrators' });
  // console.timeEnd('stats');

  // let dashboard = exp(calc.logs + (calc.fork * 2) + (calc.assist * 3) + (calc.own * 4) + (calc.created * 5));
  // dashboard.userId = getUser._id;
  // dashboard.contributions = calc.logs;
  // dashboard.fork = calc.fork;
  // dashboard.repositories = calc.created;
  // dashboard.assistant = calc.assist;
  // dashboard.owner = calc.own;

  // self.added('exp.dashboard', dashboard.userId, dashboard);
  self.ready();
});


Meteor.publish('dashboard-project', function(username) {
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
  // let getDB = Meteor.wrapAsync(function(where, callback) {
  //   mysql.find(where, function(err, result){ callback(err, result); });
  // });


  // let user_id = getUser.profile.user_id;
  // let listRepos = getDB({ '_table':'repository_contributor', '_get.user_id': user_id}).map(function (db) {
  //   return db._get.repository_id;
  // });


  // let repository = (Meteor.wrapAsync(function(where, callback) {
  //   let q = mysql.find({ 
  //     '_table':'repository', 
  //     '_get.repository_id' : { '$in': listRepos } 
  //   }).sort({'_get.updated_at': -1}).limit(5);
  //   q.exec(function(err, result) {
  //     callback(err, result);
  //   });
  // }))();







  // getDB({ repository_id : { '$in': listRepos } });

  self.added('project.dashboard', dashboard.userId, dashboard);
  self.ready();
});