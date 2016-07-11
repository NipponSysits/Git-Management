import './repository.html';

import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker'
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { FlowRouter } from 'meteor/kadira:flow-router';

const config    = require('$custom/config');
const Clipboard = require('clipboard');
const moment    = require('moment');
const md5       = require('md5');
const marked        = require("marked");


require('/imports/language')('Repository');


Tracker.autorun(function(c) {
  if(FlowRouter.subsReady()) {
    $('.ui.panel.main').fadeIn(0);
    // Session.set('prepare', true);s
  } else {
    // Session.set('prepare', false);
  }
});


Template.Repository.helpers({
  isReady: function(){
    return FlowRouter.subsReady();
  },
  Subject: function(subject, comment){
    return (!comment ?  'pushed ' : '')+subject;
  },
  htmlComment: function(comment){
    return comment.replace(/\n/ig, '<br>');
  },
  isTrue: function(comment){
    return comment ? true : false;
  },
  DomainName: function() {
    return `${location.protocol+config.domain+FlowRouter.getParam('collection')}/${FlowRouter.getParam('repository')}`;
  },
  RepositoryName: function() {
    return `${FlowRouter.getParam('collection')}/${FlowRouter.getParam('repository')}`;
  },
  Summary: function() {
    return dbReposSummary.findOne({ 
      collection: FlowRouter.getParam('collection'), 
      repository: FlowRouter.getParam('repository') 
    }) || {
      title: 'Repository Name',
      description: '',
      master: 'master',
      branch: [ 'master' ],
      readme: null,
      commits: 0,
      contributor: 0,
    };
  },
  EmptyRepository: function(){
    return `
##### clone repository on the command line

    git clone ${config.domain+FlowRouter.getParam('collection')}/${FlowRouter.getParam('repository')}

##### …or create a new repository on the command line

    echo "# deBUGerr" >> README.md
    git init
    git add README.md
    git commit -m "first commit"
    git remote add origin ${config.domain+FlowRouter.getParam('collection')}/${FlowRouter.getParam('repository')}
    git push -u origin master
`;

  },
  Markdown: function(text){
    return marked(text);
  },
  isFileEmpty: function() {
    return dbReposFile.find({ 
      collection: FlowRouter.getParam('collection'), 
      repository: FlowRouter.getParam('repository') 
    }).count() > 0 ? false : true;
  },
  Files: function() {
    return dbReposFile.find({ 
      collection: FlowRouter.getParam('collection'), 
      repository: FlowRouter.getParam('repository') 
    }, { sort: { size: 1, filename: 1 } });
  },
  IconFile: function(ext){
    return (ext ? 'file outline' : 'folder')+' icon';
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
  // let param = {
  //   collection: FlowRouter.getParam('collection'),
  //   repository: FlowRouter.getParam('repository')
  // }
  // Meteor.subscribe('repository-loaded', param, function(){
    
  // });
});


Template.Repository.onRendered(() => {
  //$('.ui.panel.main').fadeIn(300);
  $('.ui.dimmer.prepare').fadeOut(0);

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