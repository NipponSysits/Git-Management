import './userstatus.html';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { FlowRouter } from 'meteor/kadira:flow-router';

require('/imports/language')('UserStatus');




// Template.UserStatus.events({
//   'click .header.avatar #url a': function(event){
//   	// $('.form.sign-in').transition('fade right', function(){
// 		FlowRouter.go('dashboard', { username: 'dvgamer' });
//   	// });
//   }
// });

Template.UserStatus.helpers({
  getProfile: function(){
    let usr = (Meteor.user() || { profile: {} })
    return usr.profile;
  }
});



Template.UserStatus.onRendered(function() {
  let usr = (Meteor.user() || { profile: {} }).profile
  $('.header.avatar .stats.avatar').avatar(usr.email, 96);
});
