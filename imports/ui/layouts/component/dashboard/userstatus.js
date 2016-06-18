import './userstatus.html';

import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { FlowRouter } from 'meteor/kadira:flow-router';

require('/imports/language')('UserStatus');

const md5 = require('md5');

// Template.UserStatus.events({
//   'click .header.avatar #url a': function(event){
//   	// $('.form.sign-in').transition('fade right', function(){
// 		FlowRouter.go('dashboard', { username: 'dvgamer' });
//   	// });
//   }
// });

Tracker.autorun(function(c) {
  if(FlowRouter.subsReady()) {
    Session.set('sign-user', true);
  }
});

Template.UserStatus.helpers({
  isReady: function(){
    return FlowRouter.subsReady();
  },
  user: function() {
    return  dbExp.findOne({ 
      userId: Meteor.userId(), 
    });
  },
  getProfile: function(){
    let usr = (Meteor.user() || { profile: {} })
    return usr.profile;
  },
  getAvatar: function(){
    let email = (Meteor.user() || { profile: {} }).profile.email;
    return `url('//www.gravatar.com/avatar${email?`/${md5(email)}`:``}?d=mm&s=128')`;
  },
});
Template.UserStatus.onCreated(function() {
  Session.setDefault('sign-user', false);

});



Template.UserStatus.onRendered(function() {

});
