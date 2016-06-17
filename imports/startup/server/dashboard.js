import { Meteor } 	from 'meteor/meteor';

const config 		= require('$custom/config');
const mongo     = require('$custom/schema');
const Q         = require('q');
const db        = Mysql.connect(config.mysql);
const socket    = require('$custom/sentinel').clent;

const exp 			= require('/imports/api/experience');

Meteor.publish('dashboard', function(username) {
  let self = this;
  let getUser = {}, dashboard = {}
  if(username) {
  	getUser = Meteor.users.findOne({ username: username });
  } else if(self.userId) {
  	getUser = Meteor.users.findOne({ _id: self.userId });
  } else {
  	self.stop();
  }
	dashboard = exp(489);

	dashboard.userId = getUser._id;
	dashboard.contributions = 0;
	dashboard.fork = 0;
	dashboard.repositories = 0;
	dashboard.assistant = 0;
	dashboard.owner = 0;
  self.added('exp.dashboard', dashboard.userId, dashboard);
  self.ready();
});