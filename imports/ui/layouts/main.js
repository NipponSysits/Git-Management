import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
require('/imports/language')('app');
import './main.html';

Meteor.startup(() => {
	$(window).resize(function(){ $('.login-image').height($(window).height() - 118); });
});

Template.app.onRendered(function() {
	console.log('check onRendered');

  $('.ui.dimmer.prepare').fadeOut(300);

  $('.ui.access.grid').show();
  $('.ui.panel.sign-in').fadeIn(300);

	
});