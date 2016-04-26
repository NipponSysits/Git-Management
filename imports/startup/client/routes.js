import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// Import to load these templates
import '../../ui/layouts/main.js';
import '../../ui/layouts/sign/sign-in.js';

BlazeLayout.setRoot('body');

FlowRouter.route('/', {
  name: 'home',
  triggersEnter(context, redirect, stop) {
	  if (true) {
	    BlazeLayout.render('app_body', { sign: 'SignIn' });
	    stop();
	  }
	},
  action() {
    BlazeLayout.render('app_body', { main: 'dashboard' });
  },
});

// the App_notFound template is used for unknown routes and missing lists
FlowRouter.notFound = {
	subscriptions(){

	},
  action() {
    BlazeLayout.render('app_error', { main: 'main' });
  },
};