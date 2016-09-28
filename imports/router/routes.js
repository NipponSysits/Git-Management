import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { Session } from 'meteor/session';
import { Meteor } from 'meteor/meteor';

// Import to load these templates
import '../ui/layouts/component';
import '../ui/layouts/menu/navigator.js';
import '../ui/layouts/main.js';
import '../ui/layouts/error.js';

import './routes-sign.js';
import './routes-nippon.js';
import './routes-source.js';

// HomeController = RouteController.extend({
//   onBeforeAction: function () {
//     Meteor.subscribe('latestActivity', function () {
//       dataReadyHold.release();
//     });
//   }
// });

BlazeLayout.setRoot('body');

const SignAccess = function(context, redirect) {
  if(!Meteor.userId()) {
    redirect('home');
  }
}

FlowRouter.route('/', {
  name: 'home',
  action:function() {
    if(Meteor.userId()) {
      // Session.set("TITLE_PAGE", );
      // let dashboard = LaunchScreen.hold();
      Meteor.subscribe('dashboard-exp', function(){
        // dashboard.release();
        Session.set('prepare', true);
      });

      BlazeLayout.render('app', { 
        main: 'Dashboard', 
        board: 'UserStatus',
        navigator: 'Navigator'
      });
    } else {
      BlazeLayout.render('app', { sign: 'SignIn' });
    }
  }
});

FlowRouter.route('/:username', {
  name: 'dashboard',
  triggersEnter: [SignAccess],
  subscriptions: function(param){
    //this.register('dashboard', Meteor.subscribe('dashboard-exp'));
  },
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