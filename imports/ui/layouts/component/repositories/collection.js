import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker'
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { FlowRouter } from 'meteor/kadira:flow-router';

require('/imports/language')('Collections');

const moment = require('moment');

import './collection.html';


Template.Collections.helpers({
  // // the collection cursor
  CollectionReady: function() {
    return Session.get('ready-collection');
  },
  CollectionUserItems: function() {
    return dbListCollectionUser.find();
  },
  CollectionUserCount: function() {
    return dbListCollectionUser.find().count() > 0;
  },
  CollectionNameItems: function() {
    return dbListCollectionName.find();
  },
  CollectionNameCount: function() {
    return dbListCollectionName.find().count() > 0;
  },
  isDescription: function(desc){
    return desc ? true : false;
  },
  isNull: function(arg1, arg2){
    return arg1 ? arg1 : arg2;
  },
  atDate: function(date){
    return 'Updated on '+moment(date).fromNow(true);
  },
  atUser: function(user_id){
    return (Meteor.users.findOne({ 'profile.user_id': user_id }) || {}).username;
  },
  RepositoryReady: function() {
    return Session.get('ready-repository');
  },
  RepositoryItems: function(project_id) {
    let self = Session.get('click-collection');

    if(self.collection_id) {
      return dbListRepository.find({ collection_id: self.collection_id, project_id: project_id || null }, {sort:{name:1}});
    } else if(self.user_id) {
      return dbListRepository.find({ user_id: self.user_id, collection_id: null, project_id: project_id || null }, {sort:{name:1}});
    } else {
      return dbListRepository.find({ user_id: 1, collection_id: null, project_id: null }, {sort:{name:1}});
    }
    
  },
  PrejectItems: function() {
    let self = Session.get('click-collection');
    let data = [], index = [], unqiue = [];
    if(self.collection_id) {
      data = dbListRepository.find({ collection_id: self.collection_id }, {sort:{project_name:1}}).fetch();
    } else if(self.user_id) {
      data = dbListRepository.find({ user_id: self.user_id, collection_id: null }, {sort:{project_name:1}}).fetch();
    } else {
      data = dbListRepository.find({ user_id: 1, collection_id: null }, {sort:{project_name:1}}).fetch();
    }
    data.forEach(function(item){
      if(item.project_id != null && index.join('|').indexOf(item.project_id) == -1) {
        index.push(item.project_id);
        unqiue.push(item);
      }
    })
    return unqiue;
  }
});

Template.Collections.events({
  'click .collection > .ui.menu a.item': function(e) {

    $('.collection > .ui.menu a.item').removeClass('selected');
    $(e.currentTarget).addClass('selected');

    FlowRouter.setParams({ collection: this.collection_name });
    Session.set('click-collection', this);
    // Session.set('ready-repository', false);
    Meteor.subscribe('repository-list', this.collection_id, this.user_id);
  },
  'click .repository .button.repository_new': function(e){
    FlowRouter.go('repository.new');
  }
});

Tracker.autorun(function() {

});

Template.Collections.onCreated(() => {
  if(!Session.get('click-collection')) Session.set('click-collection', {});
  Session.set('ready-collection', false);
  Session.set('ready-repository', false);

  Meteor.subscribe('collection-list', function(){
    let collection_name = FlowRouter.getParam('collection');
    let self = dbListCollectionUser.findOne({collection_name:collection_name}) || dbListCollectionName.findOne({collection_name:collection_name}) || {};
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