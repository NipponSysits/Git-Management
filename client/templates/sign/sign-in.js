if (Meteor.isClient) {
	Template.app.onRendered(function() {
	  var eventBackSignIn = function() {
	    $('.ui.button.sign-in').css({ 'border-radius': 0 });
	    $('.ui.button.sign-back, .or.sign-or').hide();
	  }

	  $('.login-image').height($(window).height() - 118); 
	  $(window).resize(function(){ $('.login-image').height($(window).height() - 118); });
		$('.user-menu .item.profile .user-image').avatar('none', 64);
		$('.user-menu > .item.profile').dropdown();

	  $('.ui.remember-id').checkbox(T.Storage('signin-remember-id') || 'uncheck');
	  $('.ui.remember-id').checkbox({
	    onChange: function(){
	      T.Storage('signin-remember-id', ($(this).prop('checked') ? 'check': 'uncheck'));
	    }
	  });
	  if(T.Storage('signin-remember-id') == 'check' && T.Storage('signin-username')) {
	    $('.ui.sign-id').hide()
	    $('.ui.sign-image').show();
	    eventRememberSignIn(T.Storage('signin-username'));
	    $('.ui.sign-in.form').form('get field','email').val(T.Storage('signin-username'));
	  } else {
	    eventBackSignIn();
	  }
	});
}

