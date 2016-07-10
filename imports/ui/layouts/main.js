import './main.html';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import { Session } from 'meteor/session';
import { FlowRouter } from 'meteor/kadira:flow-router';

const $ = require('jquery');

require('malihu-custom-scrollbar-plugin')($);
require('/imports/language')('app');


Meteor.startup(() => {
	if(T.Storage('SESSION_CLIENT')) {
		Session.set('SESSION_CLIENT', T.Storage('SESSION_CLIENT'));
	}

	Tracker.autorun(function () {
		if(!Session.set('SESSION_CLIENT')) {
      console.log('logout:', Session.set('SESSION_CLIENT'))
      // Meteor.logout();
		}
	});
	window.onbeforeunload = function(e) {
	  socket.disconnect();
	};
});



Template.app.onCreated(function() {
  Session.setDefault('sign-in', false);
  Session.setDefault('prepare', false);
});

Template.app.onRendered(function() {

});

Template.app.onDestroyed(function() {
  
});