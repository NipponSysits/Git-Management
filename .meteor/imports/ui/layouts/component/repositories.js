import './repositories.html';

import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { FlowRouter } from 'meteor/kadira:flow-router';

require('/imports/language')('Repositories');

Template.Repositories.events({
	'click .grid-menu .item#repositories': function (event) {
		$('.grid-head>div>h3').html('Repositories');
		$('.grid-menu .item').removeClass('active');
		$('.grid-menu .item#repositories').addClass('active');

    Session.set('filter-name', null);
    $('.repository>.list.filter').hide();
    $('.repository>.list.view').show();
    let user = Meteor.users.findOne() || {};

    if(!dbReposList.find({ collection_name: user.username }).count()) {
      $(`.collection > .ui.menu a.item[data-item="${user.username}"] > .ui.label`).addClass('hidden');
      $(`.collection > .ui.menu a.item[data-item="${user.username}"] > .ui.button`).addClass('loading');
      $(`.collection > .ui.menu a.item`).removeClass('selected');
      $(`.collection > .ui.menu a.item[data-item="${user.username}"]`).addClass('selected');
      Meteor.subscribe('repository-list', user.username, function(){
	      $(`.collection > .ui.menu a.item[data-item="${user.username}"] > .ui.label`).removeClass('hidden');
	      $(`.collection > .ui.menu a.item[data-item="${user.username}"] > .ui.button`).removeClass('loading');
        let selected = $(`.collection > .ui.menu a.item.selected`).attr('data-item');
        if(selected == user.username) FlowRouter.go('repository.list', { collection: user.username });
      });
    } else {
      FlowRouter.go('repository.list', { collection: user.username });
    }
	},
  'click .grid-menu .item#content': function(event){
		$('.grid-head>div>h3').html('Contents');
		$('.grid-menu .item').removeClass('active');
		$('.grid-menu .item#content').addClass('active');
	  FlowRouter.go('content');
  },
  'click .grid-menu .item#fork': function(event){
		$('.grid-head>div>h3').html('Fork');
		$('.grid-menu .item').removeClass('active');
		$('.grid-menu .item#fork').addClass('active');
	  FlowRouter.go('fork');
  }
});

Template.Repositories.onCreated(function(){
	Session.set('prepare', false);
});

Template.Repositories.onRendered(() => {

	$('.ui.prepare.dimmer').transition({
    animation  : 'fade',
    duration   : '300ms',
    onComplete : function() { $('.ui.prepare.dimmer').remove(); }
  });
	
  $('.ui.panel.sign-in').hide();
  $('.ui.panel.main').show();
  
  $('.user-menu > .item').removeClass('selected');
  $('.user-menu > .item.repository').addClass('selected');
});