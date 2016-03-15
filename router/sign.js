
if (Meteor.isServer) {
	console.log(Meteor.settings);
	var liveDb = new LiveMysql(Meteor.settings.mysql);
}
Router.route('/sign/access', {where: 'server'})
.post(function () {
  var req = this.request;
  var res = this.response;
  res.end('hello from the server\n');
});
