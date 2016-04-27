import { Template } from 'meteor/templating';

import './troubleshoot.html';

Template.Troubleshoot.onRendered(function() {
  $(window).resize();
});

Template.Troubleshoot.events({
  'click .trouble-menu.forgot': function(event){
  	// $('.form.sign-in').transition('fade right', function(){
  		FlowRouter.go('forgot');
  	// });
  },
  'click .trouble-menu.register': function(event){
  	// $('.form.sign-in').transition('fade right', function(){
  		FlowRouter.go('register');
  	// });
  },
  'click .trouble-menu.back': function(event){
  	// $('.form.sign-in').transition('fade right', function(){
  		FlowRouter.go('sign');
  	// });
  }
});