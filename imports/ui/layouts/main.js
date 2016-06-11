import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import { Session } from 'meteor/session';
import { FlowRouter } from 'meteor/kadira:flow-router';

const $ = require('jquery');

require('malihu-custom-scrollbar-plugin')($);
require('/imports/language')('app');

import './main.html';

Meteor.startup(() => {
	$(window).resize(function(){ $('.login-image').height($(window).height() - 118); });
  // if (true) {
  //   FlowRouter.go('sign');
  // } else {
    // FlowRouter.go('dashboard', { username: 'dvgamer' });
  // }


});

Tracker.autorun(function(c) {
  if(Session.get('sign-in')) $('.ui.dimmer.prepare').fadeOut(300);
});

Template.app.onCreated(function() {
	
});

Template.app.onRendered(function() {
	
});

Template.app.onDestroyed(function() {
  
});