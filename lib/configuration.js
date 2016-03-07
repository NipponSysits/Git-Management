Router.configure({
  // we use the  appBody template to define the layout for the entire app
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