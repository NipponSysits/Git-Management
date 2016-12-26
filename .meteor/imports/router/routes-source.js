import '../ui/layouts/main.js';
import '../ui/layouts/component';
import '../ui/layouts/menu/navigator.js';

const SignAccess = function(context, redirect) {
  
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
  triggersEnter: [function(){
    if(!Meteor.userId()) {
      redirect('home');
    } else if(!FlowRouter.current().oldRoute) {
      BlazeLayout.render('app', { navigator: 'Navigator' });
    }
  }],
  action: function(){
    if(!Meteor.userId()) {
      BlazeLayout.render('app', { sign: 'SignIn' });
    } else {
      let dbCollection = dbListCollectionName.find({ }).count() + dbListCollectionUser.find({ }).count(); 
      if(!dbCollection) {
        $('.user-menu>.loading').transition('show');

        if(!FlowRouter.current().oldRoute) {
          Meteor.subscribe('repository-list', null, function(){

          });
        }
        Meteor.subscribe('collection-list', function(){
          $('.user-menu>.loading').transition('hide');
          if(FlowRouter.current().route.name == 'repository') {
            BlazeLayout.render('app', { main: 'Repositories', component: 'RepositoryCollection',navigator: 'Navigator' });
          }
        });
      } else {
        BlazeLayout.render('app', { main: 'Repositories', component: 'RepositoryCollection',navigator: 'Navigator' });
      }
    }
  }
});

FlowRouter.route('/Repositories/:collection', {
  name: 'repository.list',
  triggersEnter: [function(){
    if(!Meteor.userId()) {
      redirect('home');
    } else if(!FlowRouter.current().oldRoute) {
      BlazeLayout.render('app', { navigator: 'Navigator' });
    }
  }],
  action: function(){
    if(!Meteor.userId()) {
      BlazeLayout.render('app', { sign: 'SignIn' });
    } else {
      let dbCollection = dbListCollectionName.find({ }).count() + dbListCollectionUser.find({ }).count(); 
      if(!dbCollection) {
        $('.user-menu>.loading').transition('show');

        if(!FlowRouter.current().oldRoute) {
          Meteor.subscribe('repository-list', FlowRouter.getParam('collection'), function(){
            
          });
        }
        Meteor.subscribe('collection-list', function(){
          $('.user-menu>.loading').transition('hide');
          if(FlowRouter.current().route.name == 'repository.list') {
            BlazeLayout.render('app', { main: 'Repositories', component: 'RepositoryCollection',navigator: 'Navigator' });
          }
        });
      } else {
        BlazeLayout.render('app', { main: 'Repositories', component: 'RepositoryCollection',navigator: 'Navigator' });
      }
    }
  }
});

FlowRouter.route('/:collection/:repository', {
  name: 'repository.detail',
  triggersEnter: [SignAccess],
  subscriptions: function(param){
    Meteor.subscribe('repository-loaded', param, function(){
      Session.set('prepare', true);
    });
  },
  action:function() {
    BlazeLayout.render('app', { 
      main: 'Repository', 
      navigator: 'Navigator'
    });
  },
});

