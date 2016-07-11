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
    }) || {
      userId: 0,
      contributions: 0,
      fork: 0,
      repositories: 0,
      assistant: 0,
      owner: 0,
      level: 1,
      exp: 0,
      next: 0,
      percent: '0.00%'
    };
  },
  getProfile: function(){
    let usr = (Meteor.user() || { 
      profile: {
        fullname: 'Signing...',
        email: ''
      } 
    })
    return usr.profile;
  },
  getAvatar: function(){
    let gravatar = (Meteor.user() || { profile: { gravatar: '00000000000000000000000000000000' } }).profile.gravatar;
    return `url('/128/${gravatar}')`;
  },
});
Template.UserStatus.onCreated(function() {
  Session.setDefault('sign-user', false);

});



Template.UserStatus.onRendered(function() {

});
