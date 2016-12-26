import './create.html';

import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker'
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { FlowRouter } from 'meteor/kadira:flow-router';


const moment = require('moment');

require('/imports/language')('RepositoryCreate');

Template.RepositoryCreate.helpers({
  CollectionReady: function() {
    return Session.get('ready-collection');
  },
});

Template.RepositoryCreate.events({
  'click .collection > .ui.menu a.item': function(e) {

  },
  'click .ui.button.cancel': function() {
  	FlowRouter.go('repository');
  	return false;
  },
  'click .ui.button.save': function() {
		FlowRouter.go('repository');
  	return false;
  }
});

Template.RepositoryCreate.onCreated(() => {

});


Template.RepositoryCreate.onRendered(() => {
	// Session.set('prepare', true);
	$('.ui.collection.dropdown').dropdown({
    showOnFocus: false,
		onNoResults:function(val){
			if(/[^A-Za-z0-9_-]+/ig.exec(val)) {
				$(this).addClass('error');
			} else {
				$(this).removeClass('error');
			}
			$(this).dropdown('clear').dropdown('set value',val).dropdown('set text', val);
		}
	});
	$('.ui.private.checkbox').checkbox();
	$('.ui.anonymous.checkbox').checkbox();
});