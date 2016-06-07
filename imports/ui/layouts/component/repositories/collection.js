import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { FlowRouter } from 'meteor/kadira:flow-router';

require('/imports/language')('RepositoryCollection');

const moment = require('moment');

import './collection.html';


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
    // $('.collection > .ui.menu a.item').removeClass('selected');
    // $(e.currentTarget).addClass('selected');
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
  // Session.set('ready-collection', false);
  // Session.set('ready-repository', false);

  // Meteor.subscribe('collection-list', function(){
  //   let collection_name = FlowRouter.getParam('collection');
  //   let self = dbListCollectionUser.findOne({collection_name:collection_name}) || dbListCollectionName.findOne({collection_name:collection_name}) || {};
  //   if(collection_name) {
  //     $(`.collection > .ui.menu a.item[data-item="${collection_name}"]`).addClass('selected');
  //     Session.set('click-collection', self);
  //     Meteor.subscribe('repository-list', self.collection_id, self.user_id, function(){
  //       Session.set('ready-repository', true);
  //     });
  //   } else if(Meteor.userId()) {
  //     let usr = (Meteor.user() || {});
  //     $(`.collection > .ui.menu a.item[data-item="${usr.username}"]`).addClass('selected');
  //     Meteor.subscribe('repository-list', self.collection_id, self.user_id, function(){
  //       Session.set('ready-repository', true);
  //     });
  //   }

  //   Session.set('ready-collection', true);
  // });


 //  Tracker.autorun(function(c) {
 //    var collection = monCollection.findOne({ collection_name: collection_name });
 //    if(collection) {
 //      Meteor.subscribe('repository-list', collection.collection_id, collection.user_id);
 //      c.stop();
 //    }
 //  });
	// var a = Meteor.subscribe('collection', 1, function(data){
	// 	console.log(Reposs.find().fetch());
	// });
});


Template.RepositoryCollection.onRendered(() => {
  let collection_name = FlowRouter.getParam('collection') || (Meteor.user() || {}).username;
  $('.collection > .ui.menu a.item').removeClass('selected');
  $(`.collection > .ui.menu a.item[data-item="${collection_name}"]`).addClass('selected');
});