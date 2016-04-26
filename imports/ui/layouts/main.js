import './main.html';

import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';


const CONNECTION_ISSUE_TIMEOUT = 5000;

// A store which is local to this file?
const showConnectionIssue = new ReactiveVar(false);

Meteor.startup(() => {
	$(window).resize(function(){ $('.login-image').height($(window).height() - 118); });
});