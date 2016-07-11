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

});



Template.app.onCreated(function() {
  Session.setDefault('sign-in', false);
  Session.setDefault('prepare', false);
});

Template.app.onRendered(function() {
	if(T.Storage('SESSION_CLIENT')) {
		Session.set('SESSION_TIME', T.Timestamp); 
		Session.set('SESSION_ID', Meteor.userId()); 
		Session.set('SESSION_CLIENT', T.Storage('SESSION_CLIENT'));
	}

	Tracker.autorun(function () {
		if(!Session.get('SESSION_CLIENT')) {
      console.log('logout:', Session.get('SESSION_CLIENT'))
      // Meteor.logout(); 
		}
	});
});

Template.app.onDestroyed(function() {
  
});