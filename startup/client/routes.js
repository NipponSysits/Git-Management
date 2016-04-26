import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// Import to load these templates
import '../../ui/layouts/main.js';

BlazeLayout.setRoot('body');

FlowRouter.route('/', {
  name: 'home',
  action() {
    BlazeLayout.render('app_body', { sign: 'sign_in' });
  },
});

// the App_notFound template is used for unknown routes and missing lists
FlowRouter.notFound = {
  action() {
    BlazeLayout.render('app_body', { main: 'main' });
  },
};