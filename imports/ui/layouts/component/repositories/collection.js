import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker'
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { FlowRouter } from 'meteor/kadira:flow-router';

require('/imports/language')('Collections');

import './collection.html';

Template.Collections.helpers({
  // // the collection cursor
  Collection: function () {
    return Repos.find();
  },
  // CollectionReady: function() {
  //   return FlowRouter.subsReady("collection");
  // }
});

var Repos = new Mongo.Collection("repositories");
Template.Collections.onCreated(() => {
	// var a = Meteor.subscribe('collection', 1, function(data){
	// 	console.log(Reposs.find().fetch());
	// });
});


Template.Collections.onRendered(() => {

});