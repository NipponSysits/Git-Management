import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// Import to load these templates
import '../../ui/layouts/main.js';
import '../../ui/layouts/error.js';

import './routes-sign.js';

BlazeLayout.setRoot('body');

FlowRouter.route('/', {
  name: 'home',
  action() {
    BlazeLayout.render('app');
    if (true) {
      FlowRouter.go('sign');
    } else {
      BlazeLayout.render('app', { main: 'dashboard' });
    }
    
  },
});

// the App_notFound template is used for unknown routes and missing lists
FlowRouter.notFound = {
	subscriptions(){

	},
  action() {
    BlazeLayout.render('app', { error: 'error' });
  },
};