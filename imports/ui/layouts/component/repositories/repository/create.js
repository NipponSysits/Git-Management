import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker'
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { FlowRouter } from 'meteor/kadira:flow-router';

require('/imports/language')('RepositoryCreate');

const moment = require('moment');

import './create.html';

Template.RepositoryCreate.helpers({
  CollectionReady: function() {
    return Session.get('ready-collection');
  },
});

Template.RepositoryCreate.events({
  'click .collection > .ui.menu a.item': function(e) {

  }
});

Tracker.autorun(function() {

});

Template.RepositoryCreate.onCreated(() => {

});


Template.RepositoryCreate.onRendered(() => {
	$('.ui.collection.dropdown').dropdown({
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