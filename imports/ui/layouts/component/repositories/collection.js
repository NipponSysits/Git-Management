import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker'
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { FlowRouter } from 'meteor/kadira:flow-router';

require('/imports/language')('Collections');

import './collection.html';

let monCollection = new Mongo.Collection("list.repository_collection");
let monRepository = new Mongo.Collection("list.repository");

Template.Collections.helpers({
  // // the collection cursor
  isReady: function() {
    return FlowRouter.subsReady();
  },
  CollectionItems: function() {
    return monCollection.find();
  },
  RepositoryItems: function(project_id) {
    let self = Session.get('click-collection') || {};

    console.log('project_id', project_id || null);
    if(self.collection_id) {
      return monRepository.find({ collection_id: self.collection_id });
    } else if(self.user_id) {
      return monRepository.find({ user_id: self.user_id, collection_id: null });
    } else {
      return [];
    }
    
  }
});

Template.Collections.events({
  'click .collection > .ui.menu a.item': function(e) {
    $('.collection > .ui.menu a.item').removeClass('selected');
    $(e.currentTarget).addClass('selected');

    FlowRouter.setParams({ collection: this.collection_name });
    Session.set('click-collection', this);
    Meteor.subscribe('repository-list', this.collection_id, this.user_id);
  }
});

// var dbRepository = new Mongo.Collection("mysql.repository");
// var dbRepositoryCollection = new Mongo.Collection("mysql.repository_collection");
Template.Collections.onCreated(() => {

  Meteor.subscribe('collection-list', function(){
    let collection_name = FlowRouter.getParam('collection');
    if(collection_name) {
      $(`.collection > .ui.menu a.item[data-item="${collection_name}"]`).addClass('selected');
    }
  });
  Meteor.subscribe('repository-list', null, 1);

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