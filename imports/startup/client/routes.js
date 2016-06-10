import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { Session } from 'meteor/session';
import { Meteor } from 'meteor/meteor';

// Import to load these templates
import '../../ui/layouts/component';
import '../../ui/layouts/menu/navigator.js';
import '../../ui/layouts/main.js';
import '../../ui/layouts/error.js';

import './routes-sign.js';
import './routes-nippon.js';
import './routes-source.js';

BlazeLayout.setRoot('body');

const SignAccess = function(context, redirect) {
  if(!Meteor.userId()) {
    redirect('sign');
  }
}

FlowRouter.route('/', {
  name: 'home',
  triggersEnter: [SignAccess],
  action:function() {
    BlazeLayout.render('app', { 
      main: 'Dashboard', 
      board: 'UserStatus',
      navigator: 'Navigator'
    });
  }
});

FlowRouter.route('/:username?', {
  name: 'dashboard',
  triggersEnter: [SignAccess],
  action:function() {
    BlazeLayout.render('app', { 
      main: 'Dashboard', 
      board: 'UserStatus',
      navigator: 'Navigator'
    });

  },
});

// the App_notFound template is used for unknown routes and missing lists
FlowRouter.notFound = {
  action:function() {
    BlazeLayout.render('app', { board: 'error' });
  },
};