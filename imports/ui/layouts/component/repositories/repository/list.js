import './list.html';

import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { FlowRouter } from 'meteor/kadira:flow-router';

require('/imports/language')('RepositoryList');

const moment = require('moment');

Tracker.autorun(function(c) {
  if(FlowRouter.subsReady()) {
    Session.set('repository', true);
    Session.set('prepare', true);
  }
});


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
  Repository: function(project_id) {
    let collection = { 
      collection_name: FlowRouter.getParam('collection') || (Meteor.user() || {}).username, 
      project_id: project_id || null 
    };
    $('.collection > .ui.menu a.item').removeClass('selected');
    $(`.collection > .ui.menu a.item[data-item="${collection.collection_name}"]`).addClass('selected');

    return dbReposList.find(collection, { sort: { order_repository: 1 } });
    
  },
  PrejectItems: function() {
    let collection = { 
      collection_name: FlowRouter.getParam('collection') || (Meteor.user() || {}).username 
    };
    let index = [], unqiue = [];
    unqiue.push(null)
    dbReposList.find(collection, { sort: { order_project: 1 } }).fetch().forEach(function(item){
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
    $('.ui.dimmer.prepare').fadeIn(0);
    FlowRouter.go('repository.detail', { collection: this.collection_name || this.username, repository: this.repository_name+'.git' })
  },
  'click .repository .button.repository_new': function(e){
    FlowRouter.go('repository.new');
  },
  'keydown .filter.input input': funcFilter,
  'keyup .filter.input input': funcFilter
});


Template.RepositoryList.onCreated(() => {


});

Template.RepositoryList.onRendered(() => {
  Meteor.subscribe('repository-list', FlowRouter.getParam('collection'));
});
