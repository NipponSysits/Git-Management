import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { Session } from 'meteor/session';

// Import to load these templates
import '../../ui/layouts/component';
import '../../ui/layouts/menu/navigator.js';
import '../../ui/layouts/main.js';
import '../../ui/layouts/error.js';

import './routes-sign.js';

BlazeLayout.setRoot('body');

FlowRouter.route('/', {
  name: 'home',
  triggersEnter:function(context, redirect) {
    var user = Session.get('ACCESS');
    if(user) {
      redirect('dashboard', { username: user.username });
    } else {
      redirect('sign');
    }
  },
  action:function() {
    BlazeLayout.render('app');
  },
  triggersExit:function(){

  },
});

FlowRouter.route('/Repositories', {
  name: 'repository',
  subscriptions:function() {

  },
  action:function() {
    console.log('route --', FlowRouter.getRouteName(), FlowRouter.getParam());
    BlazeLayout.render('app', { 
      navigator: 'Navigator',
      main: 'Repository', 
    });
  },
});


FlowRouter.route('/Source/:collection/:repository', {
  name: 'source',
  action:function() {
    console.log('route --', FlowRouter.getRouteName(), FlowRouter.getParam());
    BlazeLayout.render('app', { 
      main: 'Dashboard', 
      board: 'UserStatus',
      navigator: 'Navigator'
    });
  },
});


FlowRouter.route('/:username', {
  name: 'dashboard',
  action:function() {
    let username = FlowRouter.getParam('username');
    if(!username) {
      Session.get('USER')
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