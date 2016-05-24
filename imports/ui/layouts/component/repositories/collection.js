import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { FlowRouter } from 'meteor/kadira:flow-router';

require('/imports/language')('Collections');

import './collection.html';

Template.Collections.helpers({
  // the collection cursor
  collection: function () {
    return Template.instance().collection();
  },
  // are there more collection to show?
  hasMorePosts: function () {
    return Template.instance().collection().count() >= Template.instance().limit.get();
  }
});

Repos = new Mongo.Collection("repositories");
Template.Collections.onCreated(() => {
	var a = Meteor.subscribe('collection', 1, function(data){
		console.log('collection', a);
	});
});


Template.Collections.onRendered(() => {
	console.log(Repos.find().fetch());
});