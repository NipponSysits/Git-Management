import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker'
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { FlowRouter } from 'meteor/kadira:flow-router';

require('/imports/language')('Collections');

import './collection.html';

let monCollection = new Mongo.Collection("list.repository_collection");

Template.Collections.helpers({
  // // the collection cursor
  isReady: function() {
    return FlowRouter.subsReady();
  },
  CollectionItems: function () {
    return monCollection.find();
  }
});

// var dbRepository = new Mongo.Collection("mysql.repository");
// var dbRepositoryCollection = new Mongo.Collection("mysql.repository_collection");
Template.Collections.onCreated(() => {
	// var a = Meteor.subscribe('collection', 1, function(data){
	// 	console.log(Reposs.find().fetch());
	// });
});


Template.Collections.onRendered(() => {
      FlowRouter.subsReady("collection", function(data) {
        console.log('collection', data);
      });
});