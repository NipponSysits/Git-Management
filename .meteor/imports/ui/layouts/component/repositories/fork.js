import './fork.html';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { FlowRouter } from 'meteor/kadira:flow-router';

require('/imports/language')('Fork');



// Template.Fork.helpers({
//   // the collection cursor
//   collection: function () {
//     return Template.instance().collection();
//   },
//   // are there more collection to show?
//   hasMorePosts: function () {
//     return Template.instance().collection().count() >= Template.instance().limit.get();
//   }
// });

// Template.Fork.onCreated(() => {
// 	var a = Meteor.subscribe('collection', 1, function(data){
// 		console.log('collection', a);
// 	});
// });


// Template.Fork.onRendered(() => {
// 	console.log(Repos.find().fetch());
// });