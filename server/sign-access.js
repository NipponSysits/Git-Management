var db = require('mysql');

Meteor.publish("sign-access", function (roomId) {
  let self = this;

  // self.stop();
  self.ready();
});