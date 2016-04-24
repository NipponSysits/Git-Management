var db = require('mysql');

Meteor.publish("sign-access", function() {
  let self = this;
  // Session.set('CLIENT', 'aerujrytukslperitkaoirest')
  // Session.set('ACCESS', { username: 'dvgamer', user_id: 1, email: 'kem@ns.co.th', fullname: 'Kananek Thongkam' })
  // self.stop();
  self.ready('test');
});