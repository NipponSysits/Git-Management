import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { FlowRouter } from 'meteor/kadira:flow-router';

require('/imports/language')('Navigator');

import './navigator.html';


Template.Navigator.helpers({
  isDebug: function(){
    return Meteor.settings.production ? false : true;
  },
  isLogin: function(){
    return Meteor.userId();
  },
	isAttended: function(){
    let usr = (Meteor.user() || { profile: {} }).profile
	  return usr.attended ? true : false;
	},
	getFullname: function(){
    let usr = (Meteor.user() || { profile: {} }).profile
	  return usr.fullname;
	},
	getPosition: function(){
    let usr = (Meteor.user() || { profile: {} }).profile
	  return usr.position;
	}, 
});

Template.Navigator.events({
	'click .user-menu .item.signin': function (event) {
		FlowRouter.go('sign');
	},
  'click .user-menu .item.home': function(event){
  	$('.user-menu > .item').removeClass('selected');
  	$('.user-menu > .item.home').addClass('selected');
  	// $('.form.sign-in').transition('fade right', function(){
    if(Meteor.userId()) {
      console.log('click');
		  FlowRouter.go('dashboard');
    } else {
      FlowRouter.go('sign');
    }
  	// });
  },
  'click .user-menu .item.repository': function(event){
  	$('.user-menu > .item').removeClass('selected');
  	$('.user-menu > .item.repository').addClass('selected');
  	// $('.form.sign-in').transition('fade right', function(){
		FlowRouter.go('repository');
  	// });
  },
  'click .user-menu .item.nippon': function(event){
  	$('.user-menu > .item').removeClass('selected');
  	$('.user-menu > .item.nippon').addClass('selected');
  	// $('.form.sign-in').transition('fade right', function(){
		FlowRouter.go('nippon');
  	// });
  },
  'click .user-menu .item.notify': function(event){
    // $('.ui.notification.sidebar').sidebar('toggle');
  },
  'click .item.profile .menu .item.profile': function(event){
  	$('.user-menu > .item').removeClass('selected');
  	$('.user-menu .menu>.item.user').addClass('selected');
  	// $('.form.sign-in').transition('fade right', function(){
		FlowRouter.go('profile');
  	// });">
  },
});

let onButton = { SignOut: false };

Template.Navigator.onRendered(function() {
	var self = this;

  $('.user-menu > .item.notify').dropdown();
  $('.user-menu > .item.profile').dropdown();
  $('.user-menu > .item.profile').avatar('kem@ns.co.th', 64);

  $('.ui.access.grid .dropdown.profile .item.signout').click(function(){
    $('.signout.modal').modal({
      closable  : false,
      onDeny : function() {
        if(!onButton.SignOut) {
          onButton.SignOut = true;
          $('.signout.modal .actions .ok.button').addClass('disabled');
          $('.signout.modal .actions .negative.button').addClass('loading');
          Meteor.logout(function(err){
            $('.signout.modal .actions .ok.button').removeClass('disabled');
            $('.signout.modal .actions .negative.button').removeClass('loading');
            if(!err) {
              $('.signout.modal').modal('hide');
              $('.ui.panel.main').fadeOut(0);
              $('.ui.panel.sign-in').fadeIn(300, function(){
                onButton.SignOut = false;
                FlowRouter.go('sign');
              }); 

            } else {
              onButton.SignOut = false;
            }
          });
        }
        return false;
      }
    }).modal('show');
  });


  // $('.header.avatar .stats.avatar').avatar(null, 96);
});
