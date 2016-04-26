import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

Meteor.startup(() => {
  // code to run on server at startup
});

FlowRouter.route('/lists/:_id', {
  name: 'Lists.show',
  action() {
    BlazeLayout.render('main', { main: 'Lists_show_page' });
  },
});

FlowRouter.route('/', {
  name: 'App.home',
  action() {
    BlazeLayout.render('main', { main: 'app_rootRedirector' });
  },
});

// the App_notFound template is used for unknown routes and missing lists
FlowRouter.notFound = {
  action() {
    BlazeLayout.render('main', { main: 'App_notFound' });
  },
};