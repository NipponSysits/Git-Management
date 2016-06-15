import './error.html';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { FlowRouter } from 'meteor/kadira:flow-router';

require('/imports/language')('error');



Template.error.onRendered(() => {
  $('.ui.dimmer.prepare').fadeOut(300);
  $('.ui.panel.sign-in, .ui.panel.main').hide();
});