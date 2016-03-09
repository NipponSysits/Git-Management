Template.signForgot.onRendered(function() {
  $(window).resize();
});

Template.signForgot.events({
  'click .forgot-back.button': function(){
  	Router.go('home');
  },
  'click .forgot-in.button': function(){
  	Router.go('home');
  }
});
