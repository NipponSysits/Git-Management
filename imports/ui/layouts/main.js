import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { FlowRouter } from 'meteor/kadira:flow-router';

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

Template.app.onCreated(function() {
	console.log('onCreated app');
});

Template.app.onRendered(function() {

});

Template.app.onDestroyed(function() {
  
});