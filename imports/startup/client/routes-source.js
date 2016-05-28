import '../../ui/layouts/main.js';
import '../../ui/layouts/component';
import '../../ui/layouts/menu/navigator.js';

const SignAccess = function(context, redirect) {
  if(!Meteor.userId()) {
    redirect('sign');
  }
}

FlowRouter.route('/Repository.New', {
  name: 'repository.new',
  triggersEnter: [SignAccess],
  action:function() {
    BlazeLayout.render('app', { 
      navigator: 'Navigator',
      repository: 'RepositoryNew',
      main: 'Repositories', 
    }); 
     
  },
});

FlowRouter.route('/Repositories/:collection?', {
  name: 'repository',
  triggersEnter: [SignAccess],
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
  triggersEnter: [SignAccess],
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
  triggersEnter: [SignAccess],
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

