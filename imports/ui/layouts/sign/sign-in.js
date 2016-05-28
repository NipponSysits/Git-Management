import { Meteor }   from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session }  from 'meteor/session';
import { FlowRouter } from 'meteor/kadira:flow-router';


import './sign-in.html';

let md5       = require('md5');
let moment    = require('moment');
let translate = require('/imports/language')('SignIn');

let onButton = { SignIn: false, SignImage: false, Nav: true };
let toPanelSignId = function(fade){
  onButton.SignImage = false;
  $('.ui.button.sign-in').css({ 'border-radius': 0 });
  $('.ui.button.sign-back, .or.sign-or').hide();
  if(!fade) {
    $('.form.sign-in .sign-image').hide();
    $('.form.sign-in .sign-id').show();
  }
}

let toPanelSignImage = function(fullname, email, fade){
  onButton.SignImage = true;
  $('.ui.button.sign-in').removeAttr('style');
  $('.ui.button.sign-back, .or.sign-or').show();
  if(!fade) {
    $('.form.sign-in .sign-id').hide();
    $('.form.sign-in .sign-image').show();
  }
  $('.field.username input').val(email);
  $('.form.sign-in .sign-avartar').avatar(email, 256);
  $('.form.sign-in .sign-email').html(fullname);
  T.Storage('signin-username', { fullname: fullname, email: email});
}


Template.SignIn.events({
  'change .ui.remember-id input': function(event) {
  	T.Storage('signin-remember-id', event.target.checked ? 'check': 'uncheck');
  },
  'click #sign-trouble': function(event){
  	// $('.form.sign-in').transition('fade right', function(){
  		FlowRouter.go('trouble');
  	// });
  },
  'click .sign-back.button': function(){
    if(!onButton.SignIn) {
      $('.ui.sign-image').transition('remove looping').transition({ 
        animation: 'fade left', 
        onComplete: function(){
          $('.ui.sign-id').transition('fade left');
        }
      });
    	toPanelSignId(true);
    }
  }
});

Template.SignIn.helpers({
  rememberId: function () {
    return '';
  }
});

Template.SignIn.onRendered(function() {
  $(window).resize();
  $('.ui.dimmer.prepare').fadeOut(300);
  $('.ui.panel.sign-in').fadeIn(300);
  $('.ui.panel.main').hide();
  $('.ui.remember-id').checkbox(T.Storage('signin-remember-id') || 'uncheck');  // 

  if(T.Storage('signin-remember-id') == 'check' && T.Storage('signin-username')) {
    let user = T.Storage('signin-username');
    toPanelSignImage(user.fullname, user.email);
    $('.field.password input').focus();
  } else {
    toPanelSignId();
    $('.field.username input').focus();
  }

  $('.ui.sign-in.form').form({
    inline : true,
    on     : 'blur',
    fields: {
      email: {
        identifier: 'email',
        rules: [
          { type: 'empty', prompt: translate('valid.email.empty') },
          { type: 'email', prompt: translate('valid.email.invalid') }
        ]
      },
      password: {
        identifier: 'password',
        rules: [
          { type: 'empty', prompt: translate('valid.password.empty') },
          { type: 'length[6]', prompt: translate('valid.password.length') }
        ]
      }

    },
    onInvalid: function() {
      $('div.ui.panel.sign-in div.ui.basic.prompt.label').each(function(i, e){
        if(!$(e).hasClass('pointing below')) $(e).removeClass('pointing').addClass('pointing below');
      });
    },
    onSuccess: function(event, fields){
      $('.button.sign-in').removeClass('positive green').addClass('loading');
      $('.ui.sign-trouble').hide();
      $('.field.username, .field.remember, .field.password, .button.sign-back').addClass('disabled');

      if(!onButton.SignIn) {
        onButton.SignIn = true;
        
        let auth = { 
          email: $('.field.username input').val(), 
          password: md5($('.field.password input').val()) 
        }

        Meteor.loginWithPassword(auth.email, auth.password, function(err){
          console.log('loginWithPassword', !err ? 'Success' : err);
          if(!err) {
            $('.ui.dimmer.prepare').fadeIn(300);
            $('.ui.panel.sign-in').fadeOut(300, function(){
              toPanelSignImage(auth.email, auth.email, true);
              return T.Init(T.Timestamp).then(function(){
                $('.ui.panel.main').fadeIn();
                //FlowRouter.go('dashboard', { username: Meteor.user().username });
                FlowRouter.go('repository');
                
              });
            });
          } else {
            if (err.reason == "User not found") {
              $('.field.username').addClass('error');
              $('.field.username input').val('').focus().blur().focus();
              $('.field.password input').val('');
            } else if (err.reason == "Incorrect password") {
              if(!onButton.SignImage) {
                $('.ui.sign-id').transition('remove looping').transition({ 
                  animation: 'fade right', 
                  onComplete: function(){
                    $('.ui.sign-image').transition('fade right');
                  }
                });
                toPanelSignImage(auth.email, auth.email, true);
              }

              $('.field.password').addClass('error');
              $('.field.password input').val('').focus().blur().focus();

            }
          }
          onButton.SignIn = false;
          $('.button.sign-in').addClass('positive green').removeClass('loading');
          $('.ui.sign-trouble').show();
          $('.field.username, .field.remember, .field.password, .button.sign-back').removeClass('disabled');
        });


      }
      return false;
    },
    onFailure: function(){ 
      return false; 
    }
  });


});