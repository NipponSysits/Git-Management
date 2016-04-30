import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import './forgot.html';

Template.Forgot.onRendered(function() {
  $(window).resize();

});

Template.Forgot.events({
  'click .forgot-back.button': function(){
  	FlowRouter.go('trouble');
  },
  'click .forgot-in.button': function(){
  	$('.forgot-in.button').addClass('loading');
  	$('.forgot-back.button').addClass('disabled');
		FlowRouter.go('forgot');
  }
});

// Template.register.events({
//   'click .trouble-menu.forgot': function(event){
//   	// $('.form.sign-in').transition('fade right', function(){
//   		FlowRouter.go('forgot');
//   	// });
//   },
//   'click .trouble-menu.register': function(event){
//   	// $('.form.sign-in').transition('fade right', function(){
//   		FlowRouter.go('register');
//   	// });
//   },
//   'click .trouble-menu.back': function(event){
//   	// $('.form.sign-in').transition('fade right', function(){
//   		FlowRouter.go('sign');
//   	// });
//   }
// });