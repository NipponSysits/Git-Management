import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { FlowRouter } from 'meteor/kadira:flow-router';

require('/imports/language')('Navigator');

import './navigator.html';


Template.Navigator.helpers({
	getFullname: function(){
		return (Session.get('USER') || { fullname: 'Unknow' }).fullname;
	},
	getPosition: function(){
		return (Session.get('USER') || { position: 'None' }).position;
	}, 
});


Template.Navigator.onRendered(function() {
  $('.user-menu > .item.profile').dropdown();

  // $('.header.avatar .stats.avatar').avatar(null, 96);
});
