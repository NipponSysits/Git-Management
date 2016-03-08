Router.configure({
  layoutTemplate: 'app',

  // // the appNotFound template is used for unknown routes and missing lists
  // notFoundTemplate: 'appNotFound',

  // // show the appLoading template whilst the subscriptions below load their data
  // loadingTemplate: 'appLoading',

  // // wait on the following subscriptions before rendering the page to ensure
  // // the data it's expecting is present
  // waitOn: function() {
  //   return [
  //     Meteor.subscribe('publicLists'),
  //     Meteor.subscribe('privateLists')
  //   ];
  // }
});

Router.route('/', function(){

  this.render('signIn', { to: 'sign' });
}, { name: 'signin' });

Router.route('/Forgot-Password', function(){
  this.render('signForgot', { to: 'sign' });
}, { name: 'forgot' });
 //  template: 'Post',
 // yieldRegions: {
 //    'MyAside': {to: 'aside'},
 //    'MyFooter': {to: 'footer'}
 //  },
 //  onBeforeAction: function () { this.next(); },
 //  onAfterAction: function () { this.next(); },