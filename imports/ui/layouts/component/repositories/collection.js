import './collection.html';

import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { FlowRouter } from 'meteor/kadira:flow-router';

require('/imports/language')('RepositoryCollection');

const moment = require('moment');



Template.RepositoryCollection.helpers({
  // // the collection cursor
  isReady: function() {
    return Session.get('ready-collection');
  },
  UsernameItems: function() {
    return dbListCollectionUser.find({}, {sort:{order_name:1}});
  },
  UsernameCount: function() {
    return dbListCollectionUser.find().count() > 0;
  },
  CollectionItems: function() {
    return dbListCollectionName.find({}, {sort:{order_name:1}});
  },
  CollectionCount: function() {
    return dbListCollectionName.find().count() > 0;
  },
  isNull: function(arg1, arg2){
    return arg1 ? arg1 : arg2;
  }
});

Template.RepositoryCollection.events({
  'click .collection > .ui.menu a.item': function(e) {
    $('.filter.input input').val('');
    FlowRouter.go('repository.list', { collection: this.collection_name });
  }
});


Tracker.autorun(function() {
  let collection_name = FlowRouter.getParam('collection') || (Meteor.user() || {}).username;
  Meteor.subscribe('collection-list', function(e) {
    $('.collection > .ui.menu a.item').removeClass('selected');
    $(`.collection > .ui.menu a.item[data-item="${collection_name}"]`).addClass('selected');
  });
});

Template.RepositoryCollection.onCreated(() => {
  
});


Template.RepositoryCollection.onRendered(() => {
  let collection_name = FlowRouter.getParam('collection') || (Meteor.user() || {}).username;
  $('.collection > .ui.menu a.item').removeClass('selected');
  $(`.collection > .ui.menu a.item[data-item="${collection_name}"]`).addClass('selected');
});