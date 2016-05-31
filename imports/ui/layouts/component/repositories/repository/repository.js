import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker'
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { FlowRouter } from 'meteor/kadira:flow-router';

const config = require('$custom/config');
const Clipboard = require('clipboard');

require('/imports/language')('Repository');
import './repository.html';

Template.Repository.helpers({
  DomainName: function() {
    return `${config.domain+FlowRouter.getParam('collection')}/${FlowRouter.getParam('repository')}`;
  },
  RepositoryName: function() {
    return `${FlowRouter.getParam('collection')}/${FlowRouter.getParam('repository')}`;
  },
});

Template.Repository.events({
  'click .collection > .ui.menu a.item': function(e) {

  }
});


Template.Repository.onCreated(() => {

});


Template.Repository.onRendered(() => {
  $('.ui.panel.sign-in').hide();
  $('.ui.panel.main').show();
  
  $('.user-menu > .item').removeClass('selected');
  $('.user-menu > .item.repository').addClass('selected');

	var clipboard = new Clipboard('.ui.button.copy');
	 
	clipboard.on('success', function(e) {
	    console.info('Action:', e.action);
	    console.info('Text:', e.text);
	    console.info('Trigger:', e.trigger);
	    e.clearSelection();
	});
	 
	clipboard.on('error', function(e) {
	    console.error('Action:', e.action);
	    console.error('Trigger:', e.trigger);
	});
});