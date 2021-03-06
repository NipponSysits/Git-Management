import './troubleshoot.html';

import { Template } from 'meteor/templating';



Template.Troubleshoot.onRendered(function() {
  $(window).resize();
  $('.ui.dimmer.prepare').fadeOut(300);
  $('.ui.panel.sign-in').fadeIn(300);
  $('.ui.panel.main').hide();
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
  		FlowRouter.go('home');
  	// });
  }
});