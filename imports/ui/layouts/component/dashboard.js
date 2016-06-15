import './dashboard.html';

import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { FlowRouter } from 'meteor/kadira:flow-router';

// import Chart from 'chart.js';

require('/imports/language')('Dashboard');




// Tracker.autorun(function(c) {
//   if(Session.get('sign-in')) {
//     console.log('Dashboard');
//     if(!$('.ui.dimmer.prepare').hasClass('hidden')) { $('.ui.dimmer.prepare').transition('fade'); }
//     c.stop();
//   }
// });


Template.Dashboard.onCreated(function(){
  $('.ui.panel.main, .ui.panel.board').hide();
});


Template.Dashboard.onRendered(() => {
  $('.ui.panel.main, .ui.panel.board').show();
  $('.ui.panel.sign-in').hide();

  $('.user-menu > .item').removeClass('selected');
  $('.user-menu > .item.home').addClass('selected');
});