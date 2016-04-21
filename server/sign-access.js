var db = require('.custom/touno-db').connect();

Meteor.publish("sign-access", function (roomId) {
  let self = this;

  // self.stop();
  self.ready();
});