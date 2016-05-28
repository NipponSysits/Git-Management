import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker'
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { FlowRouter } from 'meteor/kadira:flow-router';

require('/imports/language')('RepositoryNew');

const moment = require('moment');

import './repository_new.html';

Template.RepositoryNew.helpers({
  CollectionReady: function() {
    return Session.get('ready-collection');
  },
});

Template.RepositoryNew.events({
  'click .collection > .ui.menu a.item': function(e) {

  }
});

Tracker.autorun(function() {

});

Template.RepositoryNew.onCreated(() => {

});


Template.RepositoryNew.onRendered(() => {
	$('.ui.private.checkbox').checkbox();
	$('.ui.anonymous.checkbox').checkbox();
});