import { Meteor } 	from 'meteor/meteor';

const config 		= require('$custom/config');
const mongo     = require('$custom/schema');
const socket    = require('$custom/sentinel').clent;
const exp 			= require('/imports/api/experience');

Meteor.publish('dashboard-exp', function() {
  let self = this;
  if(!self.userId) return [];
  console.time('dashboard-exp');

  const db  = require("/imports/api/mysql");

  let getUser = Meteor.users.findOne({ _id: self.userId });
  let user_id = getUser.profile.user_id;

  let getEmail = db.query(`SELECT email FROM user_email WHERE user_id = ${user_id}`).map(function(item){
    return item.email;
  });

  calc_logs = (Meteor.wrapAsync(function(callback) {
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
  let dashboard = exp(calc_logs + (getCount.fork * 2) + (getCount.assist * 3) + (getCount.own * 4) + (getCount.created * 5));
  dashboard.userId = getUser._id;
  dashboard.contributions = calc_logs;
  dashboard.fork = getCount.fork;
  dashboard.repositories = getCount.created;
  dashboard.assistant = getCount.assist;
  dashboard.owner = getCount.own;

  self.added('exp.dashboard', self.userId, dashboard);
  self.ready();
  console.timeEnd('dashboard-exp');
});


Meteor.publish('dashboard-project', function() {
  let self = this;
  if(!self.userId) return [];
  console.time('dashboard-project');
  let getUser = Meteor.users.findOne({ _id: self.userId });

  self.added('project.dashboard', dashboard.userId, dashboard);
  self.ready();
  console.timeEnd('dashboard-project');
});