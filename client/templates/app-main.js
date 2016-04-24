Template.registerHelper('language', function(keyname){
  keyname = keyname || '';
  return '';
});


if (Meteor.isClient) {
  var md5   = require('md5');
// 	Posts = new Mongo.Collection("postsCollection");

// 	console.log(Posts, Meteor.subscribe('allPosts'));
	Meteor.startup(function () {
		$(window).resize(function(){ $('.login-image').height($(window).height() - 118); });

	});

  Template.app.onRendered(function() {
    var onSignOut = function(){
      // $('.ui.dimmer.component').transition('hide');
      $('.ui.dimmer.prepare').fadeIn(300);
      $('.ui.panel.sign-in').fadeOut(300);
      $('.ui.access.grid').hide();
    }

    var onSignIn = function(){
      // $('.ui.dimmer.component').transition('hide');
      $('.ui.dimmer.prepare').fadeOut(300);
      $('.ui.panel.sign-in').fadeIn(300);
      $('.ui.access.grid').show();
    }

    var eventBackSignIn = function() {
      $('.ui.button.sign-in').css({ 'border-radius': 0 });
      $('.ui.button.sign-back, .or.sign-or').hide();
    }

    $.when((function(){
      var aInit = $.Deferred();
      
      if(!T.Storage('SESSION_CLIENT')) {
        Meteor.call("user_access", function(user){
          console.log('user', user);
          T.Storage('SESSION_CLIENT', Session.get('CLIENT'));
          $.getScript( "//l2.io/ip.js?var=myip", function() {
            T.Storage('SESSION_IP', md5(myip));
            aInit.resolve();
          });
        });
      } else {
        $.ajaxSetup({
          dataType: 'JSON', type: 'POST',
          headers: { 'X-Requested-With': 'XMLHttpRequest', 'X-Session-Client': T.Storage('SESSION_CLIENT') }
        });
        aInit.resolve();
      }
      
      return aInit.promise();
    })()).fail(exModal).done(function () {
      console.log('SESSION_CLIENT', Session.get('ACCESS'));
      if(Session.get('ACCESS')) {
        // T.Call({ url: '/api/sign-access', data: { email: T.Storage('signin-username') } }).then(function(e, res){
        //   if(res.access) onAccess(res.user); else onSignOut();
        // });
        onSignIn();
      } else {
        onSignOut();
      }
    }).fail(function(ex){
      exModal(ex); 
    });
  });

}

