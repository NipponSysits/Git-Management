import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker'
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { FlowRouter } from 'meteor/kadira:flow-router';

require('/imports/language')('Repository');

import './repository.html';

Template.Repository.helpers({
  CollectionReady: function() {
    return false;
  },
});

Template.Repository.events({
  'click .collection > .ui.menu a.item': function(e) {

  }
});


Template.Repository.onCreated(() => {

});


Template.Repository.onRendered(() => {
  $('.ui.dimmer.prepare').fadeOut(300);
  $('.ui.panel.sign-in').hide();
  $('.ui.panel.main').show();
  
  $('.user-menu > .item').removeClass('selected');
  $('.user-menu > .item.repository').addClass('selected');

});