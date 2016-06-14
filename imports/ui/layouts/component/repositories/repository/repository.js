import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker'
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { FlowRouter } from 'meteor/kadira:flow-router';

const config    = require('$custom/config');
const Clipboard = require('clipboard');
const moment    = require('moment');
const md5       = require('md5');

require('/imports/language')('Repository');
import './repository.html';

Template.Repository.helpers({
  isReady: function(){
    return FlowRouter.subsReady();
  },
  Subject: function(subject, comment){
    return (!comment ?  'pushed ' : '')+subject;
  },
  isTrue: function(comment){
    return comment ? true : false;
  },
  DomainName: function() {
    return `${config.domain+FlowRouter.getParam('collection')}/${FlowRouter.getParam('repository')}`;
  },
  RepositoryName: function() {
    return `${FlowRouter.getParam('collection')}/${FlowRouter.getParam('repository')}`;
  },
  Summary: function() {
    return dbReposSummary.findOne({ 
      collection: FlowRouter.getParam('collection'), 
      repository: FlowRouter.getParam('repository') 
    });
  },
  isLogsEmpty: function() {
    return dbReposLogs.find({ 
      collection: FlowRouter.getParam('collection'), 
      repository: FlowRouter.getParam('repository') 
    }).count() > 0 ? false : true;
  },
  HistoryMore: function(){
    return dbReposLogs.find({ 
      collection: FlowRouter.getParam('collection'), 
      repository: FlowRouter.getParam('repository') 
    }).count() > 12 ? true : false;
  },
  HistoryLogs: function() {
    return dbReposLogs.find({ 
      collection: FlowRouter.getParam('collection'), 
      repository: FlowRouter.getParam('repository') 
    }, { sort: { since: -1 }, limit: 12 });
  },
  Avatar: function(email){
    return `//www.gravatar.com/avatar/${md5(email)}?d=mm`;
  },
  OnDate: function(date){
    return date ? moment(date).fromNow(true) : '';
  },
});

Template.Repository.events({
  'change .filter.input input': function(e) {
  	//(new RegExp('a', 'ig')).exec($('.repository .ui.list > .item .header').html())
  }
});


Template.Repository.onCreated(() => {

});


Template.Repository.onRendered(() => {
  $('.ui.panel.sign-in').hide();
  $('.ui.panel.main').show();
  $('.ui.branch.dropdown').dropdown();

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