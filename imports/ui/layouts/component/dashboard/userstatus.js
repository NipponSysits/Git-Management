import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { FlowRouter } from 'meteor/kadira:flow-router';

require('/imports/language')('UserStatus');

import './userstatus.html';


// Template.UserStatus.events({
//   'click .header.avatar #url a': function(event){
//   	// $('.form.sign-in').transition('fade right', function(){
// 		FlowRouter.go('dashboard', { username: 'dvgamer' });
//   	// });
//   }
// });


Template.UserStatus.onRendered(function() {

  $('.header.avatar .stats.avatar').avatar(null, 96);
});
