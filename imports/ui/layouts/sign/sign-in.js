import { Template } from 'meteor/templating';

import './sign-in.html';

Template.SignIn.events({
  'change .ui.remember-id input': function(event) {
  	T.Storage('signin-remember-id', event.target.checked ? 'check': 'uncheck');
  },
  'click #sign-trouble': function(event){
  	// $('.form.sign-in').transition('fade right', function(){
  		FlowRouter.go('trouble');
  	// });
  },
  'click .sign-in.button': function(){
  	console.log('click .sign-in.button');

  	return false;
  },
  'click .sign-back.button': function(){
  	console.log('.sign-back.button');
  }
});

Template.SignIn.helpers({
  rememberId: function () {
    return '';
  }
});

Template.SignIn.onRendered(function() {
  var self = this;
  var eventBackSignIn = function() {
    $('.ui.button.sign-in').css({ 'border-radius': 0 });
    $('.ui.button.sign-back, .or.sign-or').hide();
  }

  var onSignIn = function(){
    // $('.ui.dimmer.component').transition('hide');
    $('.ui.dimmer.prepare').fadeOut(300);
    $('.ui.panel.sign-in').fadeIn(300);
    $('.ui.access.grid').show();
  }
  onSignIn();
  $(window).resize();
  $('.user-menu').hide();
  // avatar('.user-menu .item.profile .user-image', 'none', 64);

  $('.ui.remember-id').checkbox('uncheck');  // T.Storage('signin-remember-id') || 

  // if(T.Storage('signin-remember-id') == 'check' && T.Storage('signin-username')) {
  //   $('.ui.sign-id').hide()
  //   $('.ui.sign-image').show();
  //   eventRememberSignIn(T.Storage('signin-username'));
  //   $('.ui.sign-in.form').form('get field','email').val(T.Storage('signin-username'));
  // } else {
  //   eventBackSignIn();
  // }
});