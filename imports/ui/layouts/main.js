import './main.html';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';


Meteor.startup(() => {
	$(window).resize(function(){ $('.login-image').height($(window).height() - 118); });
});
