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