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

BlazeLayout.setRoot('body');

const SignAccess = function(context, redirect) {
  if(!Meteor.userId()) {
    console.log('SignAccess', T.Storage('SESSION_CLIENT'));
    // Session.set('redirect', FlowRouter.getRouteName())
    redirect('sign');
  }
}
const Dashboard = function(context, redirect) {
  console.log(Meteor.userId(), 'user', Meteor.user());
  if(Meteor.userId()) redirect('dashboard', { username: 'dvgamer' });
}

FlowRouter.route('/', {
  name: 'home',
  triggersEnter: [Dashboard, SignAccess],
  action:function() {
    BlazeLayout.render('app');
  },
  triggersExit:function(){

  },
});

FlowRouter.route('/Repositories', {
  name: 'repository',
  action:function() {
    console.log('route --', FlowRouter.getRouteName(), FlowRouter.getParam());
    BlazeLayout.render('app', { 
      navigator: 'Navigator',
      main: 'Repository', 
    });
  },
});


FlowRouter.route('/:collection/:repository', {
  name: 'source',
  triggersEnter: [SignAccess],
  action:function() {
    console.log('route --', FlowRouter.getRouteName(), FlowRouter.getParam('collection'), FlowRouter.getParam('repository'));
    BlazeLayout.render('app', { 
      main: 'Dashboard', 
      navigator: 'Navigator'
    });
  },
});


FlowRouter.route('/:username', {
  name: 'dashboard',
  action:function() {
    let username = FlowRouter.getParam('username');
    if(!username) {
      // Session.get('USER')
    }

    console.log('route --', FlowRouter.getRouteName(), FlowRouter.getParam());
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