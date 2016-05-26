import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker'
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { FlowRouter } from 'meteor/kadira:flow-router';

require('/imports/language')('Collections');

import './collection.html';

let monCollectionName = new Mongo.Collection("list.collection-name");
let monCollectionUser = new Mongo.Collection("list.collection-user");
let monRepository = new Mongo.Collection("list.repository");

Template.Collections.helpers({
  // // the collection cursor
  CollectionReady: function() {
    return Session.get('ready-collection');
  },
  CollectionUserItems: function() {
    return monCollectionUser.find();
  },
  CollectionNameItems: function() {
    return monCollectionName.find();
  },
  showDesc: function(desc){
    return desc ? true : false;
  },
  RepositoryReady: function() {
    return Session.get('ready-repository');
  },
  RepositoryItems: function(project_id) {
    let self = Session.get('click-collection');

    console.log('RepositoryItems', self);
    console.log('project_id', project_id || null);
    if(self.collection_id) {
      console.log('self.collection_id', monRepository.find({ collection_id: self.collection_id }).count());
      return monRepository.find({ collection_id: self.collection_id });
    } else if(self.user_id) {
      return monRepository.find({ user_id: self.user_id, collection_id: null });
    } else {
      return monRepository.find({ user_id: 1, collection_id: null });
    }
    
  }
});

Template.Collections.events({
  'click .collection > .ui.menu a.item': function(e) {

    $('.collection > .ui.menu a.item').removeClass('selected');
    $(e.currentTarget).addClass('selected');

    FlowRouter.setParams({ collection: this.collection_name });
    Session.set('click-collection', this);
    Session.set('ready-repository', false);
    Meteor.subscribe('repository-list', this.collection_id, this.user_id, function(){
      Session.set('ready-repository', true);
    });
  }
});

// var dbRepository = new Mongo.Collection("mysql.repository");
// var dbRepositoryCollection = new Mongo.Collection("mysql.repository_collection");

Template.Collections.onCreated(() => {
  if(!Session.get('click-collection')) Session.set('click-collection', {});
  Session.set('ready-collection', false);
  Session.set('ready-repository', false);

  Meteor.subscribe('collection-list', function(){
    let collection_name = FlowRouter.getParam('collection');
    let self = monCollectionUser.findOne({collection_name:collection_name}) || monCollectionName.findOne({collection_name:collection_name}) || {};
    if(collection_name) {
      $(`.collection > .ui.menu a.item[data-item="${collection_name}"]`).addClass('selected');
      Session.set('click-collection', self);
      Meteor.subscribe('repository-list', self.collection_id, self.user_id, function(){
        Session.set('ready-repository', true);
      });
    } else if(Meteor.userId()) {
      let usr = (Meteor.user() || {});
      $(`.collection > .ui.menu a.item[data-item="${usr.username}"]`).addClass('selected');
      Meteor.subscribe('repository-list', self.collection_id, self.user_id, function(){
        Session.set('ready-repository', true);
      });
    }

    Session.set('ready-collection', true);
  });


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


Template.Collections.onRendered(() => {

});