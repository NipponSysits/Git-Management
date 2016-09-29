import { Meteor } 	from 'meteor/meteor';

const config 		= require('$custom/config');
const mongo     = require('$custom/schema');
const socket    = require('$custom/sentinel').clent;
const exp 			= require('/imports/api/experience');
const db        = require("/imports/api/mysql");

Meteor.publish('dashboard-exp', function(username) {
  console.time('dashboard-exp');
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

  let getEmail = db.query(`SELECT email FROM user_email WHERE user_id = ${user_id}`).map(function(item){
    return item.email;
  });

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

  let query = ` 
    SELECT SUM(fork) fork, SUM(created) created, SUM(assist) assist, SUM(own) own  
    FROM ( 
      SELECT COUNT(*) fork, 0 created, 0 assist, 0 own FROM repository 
      WHERE created_id = ${user_id} AND fork_id IS NOT NULL 
      UNION ALL 
      SELECT 0 fork, COUNT(*) created, 0 assist, 0 own FROM repository 
      WHERE created_id = ${user_id} AND content_id IS NULL AND fork_id IS NULL 
      UNION ALL 
      SELECT 0 fork, 0 created, COUNT(*) assist, 0 own FROM repository_contributor 
      WHERE user_id = ${user_id} AND permission = 'Contributors' 
      UNION ALL 
      SELECT 0 fork, 0 created, 0 assist, COUNT(*) own FROM repository_contributor 
      WHERE user_id = ${user_id} AND permission = 'Administrators' 
    ) s 
  `; 

  let getCount = db.one(query);
  calc.fork = getCount.fork;
  calc.created = getCount.created;
  calc.assist = getCount.assist;
  calc.own = getCount.own;

  let dashboard = exp(calc.logs + (calc.fork * 2) + (calc.assist * 3) + (calc.own * 4) + (calc.created * 5));
  dashboard.userId = getUser._id;
  dashboard.contributions = calc.logs;
  dashboard.fork = calc.fork;
  dashboard.repositories = calc.created;
  dashboard.assistant = calc.assist;
  dashboard.owner = calc.own;

  self.added('exp.dashboard', dashboard.userId, dashboard);
  self.ready();
  console.timeEnd('dashboard-exp');
});


Meteor.publish('dashboard-project', function(username) {
  console.time('dashboard-project');
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

  self.added('project.dashboard', dashboard.userId, dashboard);
  self.ready();
  console.timeEnd('dashboard-project');
  console.log();
});