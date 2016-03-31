
Template.signIn.events({
  'change .ui.remember-id input': function(event) {
  	T.Storage('signin-remember-id', event.target.checked ? 'check': 'uncheck');
  },
  'click #sign-trouble': function(event){
  	// $('.form.sign-in').transition('fade right', function(){
  		Router.go('forgot');
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

Template.signIn.helpers({
  rememberId: function () {
    return '';
  }
});

Template.signIn.onRendered(function() {
  var eventBackSignIn = function() {
    $('.ui.button.sign-in').css({ 'border-radius': 0 });
    $('.ui.button.sign-back, .or.sign-or').hide();
  }

  $(window).resize();
  avatar('.user-menu .item.profile .user-image', 'none', 64);
	$('.user-menu > .item.profile').dropdown();
  $('.ui.remember-id').checkbox(T.Storage('signin-remember-id') || 'uncheck');

  if(T.Storage('signin-remember-id') == 'check' && T.Storage('signin-username')) {
    $('.ui.sign-id').hide()
    $('.ui.sign-image').show();
    eventRememberSignIn(T.Storage('signin-username'));
    $('.ui.sign-in.form').form('get field','email').val(T.Storage('signin-username'));
  } else {
    eventBackSignIn();
  }
});