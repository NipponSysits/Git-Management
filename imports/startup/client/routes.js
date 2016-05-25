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
    redirect('sign');
  }
}
const Dashboard = function(context, redirect) {
  if(Meteor.userId()) {
    redirect('dashboard', { username: 'dvgamer' });
  }
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

FlowRouter.route('/Repositories/:collection?', {
  name: 'repository',
  subscriptions: function(params, queryParams) {
    this.register('collection', Meteor.subscribe('collection', 1));
  },
  action:function() {
    BlazeLayout.render('app', { 
      navigator: 'Navigator',
      repository: 'Collections',
      main: 'Repositories', 
    }); 
     
  },
});

FlowRouter.route('/Contents/:name?', {
  name: 'content',
  action:function() {
    BlazeLayout.render('app', { 
      navigator: 'Navigator',
      repository: 'Content',
      main: 'Repositories', 
    }); 
     
  },
});

FlowRouter.route('/Fork', {
  name: 'fork',
  action:function() {
    BlazeLayout.render('app', { 
      navigator: 'Navigator',
      repository: 'Fork',
      main: 'Repositories', 
    }); 
     
  },
});


FlowRouter.route('/:collection/:repository', {
  name: 'source',
  triggersEnter: [SignAccess],
  action:function() {
    BlazeLayout.render('app', { 
      main: 'Dashboard', 
      navigator: 'Navigator'
    });
  },
});


FlowRouter.route('/:username', {
  name: 'dashboard',
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