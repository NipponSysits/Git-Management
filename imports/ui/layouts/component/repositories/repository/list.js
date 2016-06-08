import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
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
  isTrue: function(desc){
    return desc ? true : false;
  },
  isNull: function(arg1, arg2){
    return arg1 ? arg1 : arg2;
  },
  isYes: function(arg1, arg2){
    return arg1 == 'YES' || arg2 == 'YES' ? true : false;
  },
  atDate: function(date){
    return date ? moment(date).fromNow(true)+' ago' : '';
  },
  isReady: function() {
    return Session.get('repository');
  },
  Repository: function(project_id) {
    let collection = { collection_name: FlowRouter.getParam('collection') || (Meteor.user() || {}).username };
    if(collection) {
      let self = dbListCollectionName.findOne(collection) || dbListCollectionUser.findOne(collection) || {};

      $('.collection > .ui.menu a.item').removeClass('selected');
      $(`.collection > .ui.menu a.item[data-item="${collection.collection_name}"]`).addClass('selected');

      if(self.collection_id) {
        return dbReposList.find({ collection_id: self.collection_id, project_id: project_id || null }, {sort:{order_repository:1}});
      } else if(self.user_id) {
        return dbReposList.find({ user_id: self.user_id, collection_id: null, project_id: project_id || null }, {sort:{order_repository:1}});
      } else {
        return dbReposList.find({ user_id: 1, collection_id: null, project_id: null }, {sort:{order_repository:1}});
      }
    }
    
  },
  PrejectItems: function() {
    let collection = { collection_name: FlowRouter.getParam('collection') || (Meteor.user() || {}).username };
    let self = dbListCollectionName.findOne(collection) || dbListCollectionUser.findOne(collection) || {};

    let data = [], index = [], unqiue = [];
    if(self.collection_id) {
      data = dbReposList.find({ collection_id: self.collection_id }, {sort:{order_project:1}}).fetch();
    } else if(self.user_id) {
      data = dbReposList.find({ user_id: self.user_id, collection_id: null }, {sort:{order_project:1}}).fetch();
    } else {
      data = dbReposList.find({ user_id: 1, collection_id: null }, {sort:{order_project:1}}).fetch();
    }
    unqiue.push(null)
    data.forEach(function(item){
      if(item.project_id != null && index.join('|').indexOf(item.project_id) == -1) {
        index.push(item.project_id);
        unqiue.push(item);
      }
    })
    return unqiue;
  }
});

var funcFilter = function(e) {
  if($(e.currentTarget).val().trim() !== "") {
    $('.repository .ui.list > .item').each(function(i, list){
      if((new RegExp($(e.currentTarget).val().trim(), 'ig')).exec($(list).find('.header').html())) {
        $(list).removeClass('hidden').addClass('visible');
      } else {
        $(list).removeClass('visible').addClass('hidden');
      }
    });
  } else {
    $('.repository .ui.list > .item.hidden').removeClass('hidden');
  }
}


Template.RepositoryList.events({
  'click .column.repository .list > div.item': function(){
    FlowRouter.go('repository.detail', { collection: this.collection_name || this.username, repository: this.repository_name+'.git' })
  },
  'click .repository .button.repository_new': function(e){
    FlowRouter.go('repository.new');
  },
  'keydown .filter.input input': funcFilter,
  'keyup .filter.input input': funcFilter
});

Template.RepositoryList.onCreated(() => {
  Session.setDefault('repository', false);
});

Template.RepositoryList.onRendered(() => {
  Meteor.subscribe('collection-list', function(){
    
  });
  Meteor.subscribe('repository-list', function(){
    Session.set('repository', true);
  });
});
