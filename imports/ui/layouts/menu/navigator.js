import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { FlowRouter } from 'meteor/kadira:flow-router';

require('/imports/language')('Navigator');

import './navigator.html';


Template.Navigator.helpers({
	isLogin: function(){
    let ac = Session.get('ACCESS');
		return ac ? true : false;
	},
	isAttended: function(){
    let ac = Session.get('ACCESS');
		return ac.attended ? true : false;
	},
	getFullname: function(){
    let ac = Session.get('ACCESS') || { fullname: 'Unknow' };
		return ac.fullname;
	},
	getPosition: function(){
    let ac = Session.get('ACCESS') || { position: 'None' };
		return ac.position;
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
		FlowRouter.go('dashboard');
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
  'click .item.profile .menu .item.profile': function(event){
  	$('.user-menu > .item').removeClass('selected');
  	$('.user-menu > .item.profile').addClass('selected');
  	// $('.form.sign-in').transition('fade right', function(){
		FlowRouter.go('nippon');
  	// });
  },
});

Template.Navigator.onRendered(function() {
	var self = this;
  $('.user-menu > .item.profile').dropdown();

  // $('.header.avatar .stats.avatar').avatar(null, 96);
});
