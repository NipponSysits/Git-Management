import { Meteor } 	from 'meteor/meteor';

const config 		= require('$custom/config');
const mongo     = require('$custom/schema');
const Q         = require('q');
const db        = Mysql.connect(config.mysql);
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
  let getEmail = function(){
    let def = Q.defer();
    db.query(`SELECT email FROM user_email WHERE user_id = ${user_id}`, function(err, data){
      if(err || data.length == 0) { 
        def.reject(err); 
      } else { 
        let email = data.map(function(user){ return user.email; });
        def.resolve(email);
      }
    });
    return def.promise;
  }

  getEmail().then(function(email){
    let def = Q.defer();
    let commits = mongo.Commit.aggregate( [
      { $match : { email : { '$in': email }, logs: true } },
      { $group : { 
        _id : { commit_id : "$commit_id", email: "$email" }, 
        alike: { $push: "$repository_id" }, 
        count: { $sum: 1 } } 
      }
    ]);



    commits.exec(function(err, logs){
      if(err) {
        def.reject(err);
      } else {
        calc.logs = logs.length;
        def.resolve();
      }
    });

    return def.promise;
  }).then(function(){

    let def = Q.defer();
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

    db.query(query, function(err, data){
      if(err || data.length == 0) {
        def.reject(err);
      } else {
        calc.fork = parseInt(data[0].fork);
        calc.created = parseInt(data[0].created);
        calc.assist = parseInt(data[0].assist);
        calc.own = parseInt(data[0].own);
        def.resolve();
      }
    });
    return def.promise;
  }).then(function(){
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



});