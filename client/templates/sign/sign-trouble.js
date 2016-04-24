Template.signTroubleshoot.onRendered(function() {
  $(window).resize();
});


Template.signTroubleshoot.events({
  'click .trouble-menu.forgot': function(event){
  	// $('.form.sign-in').transition('fade right', function(){
  		Router.go('forgot');
  	// });
  },
  'click .trouble-menu.register': function(event){
  	// $('.form.sign-in').transition('fade right', function(){
  		Router.go('register');
  	// });
  },
  'click .trouble-menu.back': function(event){
  	// $('.form.sign-in').transition('fade right', function(){
  		Router.go('home');
  	// });
  }
});