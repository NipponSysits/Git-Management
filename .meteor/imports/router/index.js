import './routes.js';
import './dbCollections.js';

import './event-socket.js';

BlazeLayout.setRoot('body');
BlazeLayout.template = function(TemplateObject) {
  this.render('app', {});
};
