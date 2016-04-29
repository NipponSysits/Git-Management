import { Template } from 'meteor/templating';

import './register.html';

Template.Register.onRendered(function() {
  $(window).resize();

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