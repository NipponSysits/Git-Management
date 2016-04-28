import { Template } from 'meteor/templating';
import { Session }  from 'meteor/session';

import './error.html';

Template.error.onRendered(() => {
  $('.ui.dimmer.prepare').fadeOut(300);
  $('.ui.panel.sign-in, .ui.panel.main').hide();
});