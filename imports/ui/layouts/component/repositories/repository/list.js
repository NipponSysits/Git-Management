import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker'
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { FlowRouter } from 'meteor/kadira:flow-router';

require('/imports/language')('RepositoryList');

const moment = require('moment');

import './list.html';


// Tracker.autorun(function() {
//   let collection_name = FlowRouter.getParam('collection') || (Meteor.user() || {}).username;
//   Meteor.subscribe('collection-list', function(e) {
//     $('.collection > .ui.menu a.item').removeClass('selected');
//     $(`.collection > .ui.menu a.item[data-item="${collection_name}"]`).addClass('selected');
//   });
// });


Template.RepositoryList.helpers({
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
  isReady: function() {
    return Session.get('collection');
  },
  Repository: function(project_id) {
    let collection = { collection_name: FlowRouter.getParam('collection') || (Meteor.user() || {}).username };
    let self = dbListCollectionName.findOne(collection) || dbListCollectionUser.findOne(collection);

    if(self.collection_id) {
      return dbListRepository.find({ collection_id: self.collection_id, project_id: project_id || null }, {sort:{name:1}});
    } else if(self.user_id) {
      return dbListRepository.find({ user_id: self.user_id, collection_id: null, project_id: project_id || null }, {sort:{name:1}});
    } else {
      return dbListRepository.find({ user_id: 1, collection_id: null, project_id: null }, {sort:{name:1}});
    }
    
  },
  PrejectItems: function() {
    let collection = { collection_name: FlowRouter.getParam('collection') || (Meteor.user() || {}).username };
    let self = dbListCollectionName.findOne(collection) || dbListCollectionUser.findOne(collection);

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

Template.RepositoryList.events({
  'click .column.repository .list > div.item': function(){
    FlowRouter.go('repository.detail', { collection: this.collection_name || this.username, repository: this.repository_name+'.git' })
  },
  'click .repository .button.repository_new': function(e){
    FlowRouter.go('repository.new');
  }
});

Template.RepositoryList.onCreated(() => {
  Session.setDefault('collection', false);
});

Template.RepositoryList.onRendered(() => {
  Meteor.subscribe('collection-list', function(){
    let name = FlowRouter.getParam('collection') || (Meteor.user() || {}).username;
    let collection = { collection_name: name };
    let self = dbListCollectionName.findOne(collection) || dbListCollectionUser.findOne(collection);
    Session.set('collection', true);
    Meteor.subscribe('repository-list', self.collection_id, self.user_id);
  });
});
