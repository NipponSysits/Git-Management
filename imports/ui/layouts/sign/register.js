import './register.html';

import { Template } from 'meteor/templating';



Template.Register.onRendered(function() {
  $(window).resize();
  $('.ui.dimmer.prepare').fadeOut(300);
  $('.ui.panel.sign-in').fadeIn(300);
  $('.ui.panel.main').hide();
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