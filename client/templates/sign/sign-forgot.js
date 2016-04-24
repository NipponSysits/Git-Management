Template.signForgot.onRendered(function() {
  $(window).resize();
});

Template.signForgot.events({
  'click .forgot-back.button': function(){
  	Router.go('trouble');
  },
  'click .forgot-in.button': function(){
  	$('.forgot-in.button').addClass('loading');
  	$('.forgot-back.button').addClass('disabled');
  	console.log('click');
		Router.go('forgot');
  }
});
