import './userstatus.html';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

require('/imports/language')('UserStatus');

Template.UserStatus.helpers({
  user: function() {
    return  dbExp.findOne({ 
      userId: Meteor.userId(), 
    }) || {
      userId: 0,
      contributions: 0,
      fork: 0,
      repositories: 0,
      assistant: 0,
      owner: 0,
      level: 1,
      exp: 0,
      next: 0,
      percent: '0.00%'
    };
  }
});


Template.UserStatus.onCreated(function() {

});

Template.UserStatus.onRendered(function() {
  // Meteor.subscribe('dashboard-exp');
});
