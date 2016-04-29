import { Template } from 'meteor/templating';
import { Session }  from 'meteor/session';

import './sign-in.html';
require('/imports/language')('SignIn');

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

let toPanelSignImage = function(email, fade){
  onButton.SignImage = true;
  $('.ui.button.sign-in').removeAttr('style');
  $('.ui.button.sign-back, .or.sign-or').show();
  if(!fade) {
    $('.form.sign-in .sign-id').hide();
    $('.form.sign-in .sign-image').show();
  }
  $('.field.username input').val(email);
  $('.form.sign-in .sign-avartar').avatar(email, 256);
  $('.form.sign-in .sign-email').html(email);
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

  $('.ui.access.grid').show();
  $('.ui.panel.sign-in').fadeIn(300);

  T.Storage('signin-username', 'kem@ns.co.th');
  $('.ui.remember-id').checkbox(T.Storage('signin-remember-id') || 'uncheck');  // 



  if(T.Storage('signin-remember-id') == 'check' && T.Storage('signin-username')) {
    toPanelSignImage(T.Storage('signin-username'));
  } else {
    toPanelSignId();
  }

  $('.ui.sign-in.form').form({
    inline : true,
    on     : 'blur',
    fields: {
      email: {
        identifier: 'email',
        rules: [
          { type: 'empty', prompt: 'Please enter your e-mail again' },
          { type: 'email', prompt: 'Please enter a valid e-mail' }
        ]
      },
      password: {
        identifier: 'password',
        rules: [
          { type: 'empty', prompt: 'Please enter your password again' },
          { type: 'length[6]', prompt: 'Your password must be at least 6 characters' }
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
          username: $('.field.username input').val(), 
          password: $('.field.password input').val() 
        }

        T.Call('user-verify', auth).then(function(data){
          console.log('user-verify');
        });


        if(!onButton.SignImage) {
          $('.ui.sign-id').transition('remove looping').transition({ 
            animation: 'fade right', 
            onComplete: function(){
              $('.ui.sign-image').transition('fade right');
            }
          });
          toPanelSignImage($('.field.username input').val(), true);
        }


        // T.Call({ url:'/api/sign-in', data: fields }).then(function(e, res){
        //   $('.ui.sign-in.button').removeClass('loading');
        //   if (!e.onError) {
        //     // display: "Kananek T.", email: "kem@ns.co.th"
        //     $('.ui.sign-in.form').form('get field','password').val('');
        //     $('.ui.dimmer.prepare').transition('fade');
        //     $('.ui.panel.sign-in').fadeOut(300, function(){
        //       onAccess(res.user, 'dashboard');
        //       eventSignInSuccess();
        //     });
        //   } else {
        //     eventSignInSuccess();
        //     $('.ui.access.grid').hide();
        //     if(!res.name) {
        //       //console.log('username fail');
        //       $('.field.username').addClass('error');
        //       $('.field.username input').focus();
        //     }
        //     if(!res.pass) {
        //       //console.log('password fail');
              onButton.SignIn = false;
              $('.field.password').addClass('error');
              $('.field.password input').val('').focus().blur().focus();
        //     }

        //   }

        //   if(res.name && $('.ui.sign-image').css('display') == 'none') {
        //     T.Storage('signin-username', $('.ui.sign-in.form').form('get field','email').val());
        //     $('.ui.sign-id').transition('remove looping').transition({ 
        //       animation: 'fade right', 
        //       onComplete: function(){
        //         $('.ui.sign-image').transition('fade right');
        //       }
        //     });
        //     eventRememberSignIn($('.ui.sign-in.form').form('get field','email').val());
        //   }
            $('.button.sign-in').addClass('positive green').removeClass('loading');
            $('.ui.sign-trouble').show();
            $('.field.username, .field.remember, .field.password, .button.sign-back').removeClass('disabled');

        // });
      }
      return false;
    },
    onFailure: function(){ 
      return false; 
    }
  });


});