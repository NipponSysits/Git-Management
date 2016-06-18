import '../../ui/layouts/main.js';
import '../../ui/layouts/component';
import '../../ui/layouts/menu/navigator.js';

const SignAccess = function(context, redirect) {
  if(!Meteor.userId()) redirect('sign');
}

FlowRouter.route('/Repository.New', {
  name: 'repository.new',
  triggersEnter: [SignAccess],
  action:function() {
    BlazeLayout.render('app', { 
      navigator: 'Navigator',
      component: 'RepositoryCreate',
      main: 'Repositories', 
    }); 
     
  },
});

FlowRouter.route('/Repositories', {
  name: 'repository',
  triggersEnter: [SignAccess],
  subscriptions: function(param){
    this.register('rcollection-list', Meteor.subscribe('collection-list', { username: 'dvgamer' } ));
    // this.register('repository-list', Meteor.subscribe('repository-list'));
  },
  action:function() {
    BlazeLayout.render('app', { 
      navigator: 'Navigator',
      component: 'RepositoryCollection',
      main: 'Repositories', 
    }); 
     
  },
});

FlowRouter.route('/Repositories/:collection', {
  name: 'repository.list',
  triggersEnter: [SignAccess],
  subscriptions: function(param){
    this.register('rcollection-list', Meteor.subscribe('collection-list', param));
    // this.register('repository-list', Meteor.subscribe('repository-list', param));
  },
  action:function() {
    BlazeLayout.render('app', { 
      navigator: 'Navigator',
      component: 'RepositoryCollection',
      main: 'Repositories', 
    }); 
     
  },
});

FlowRouter.route('/Contents/:name?', {
  name: 'content',
  triggersEnter: [SignAccess],
  action:function() {
    BlazeLayout.render('app', { 
      navigator: 'Navigator',
      component: 'Content',
      main: 'Repositories', 
    }); 
     
  },
});

FlowRouter.route('/Fork', {
  name: 'fork',
  triggersEnter: [SignAccess],
  action:function() {
    BlazeLayout.render('app', { 
      navigator: 'Navigator',
      component: 'Fork',
      main: 'Repositories', 
    }); 
     
  },
});


FlowRouter.route('/:collection/:repository', {
  name: 'repository.detail',
  triggersEnter: [SignAccess],
  subscriptions: function(param){
    this.register('repository-loaded', Meteor.subscribe('repository-loaded', param));
  },
  action:function() {
    BlazeLayout.render('app', { 
      main: 'Repository', 
      navigator: 'Navigator'
    });
  },
});

