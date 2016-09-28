const Q         = require('q');
const md5      	= require('md5');
const Push      = require('push.js');
const config		= location.hostname == 'dev.ns.co.th' ? 'http://dev.ns.co.th:811' : 'http://localhost:8200';
const socket  	= require('socket.io-client')(config);

// Fixed bug repository for other socket.
import Response from 'meteor-node-stubs/node_modules/http-browserify/lib/response';
if(!Response.prototype.setEncoding) { Response.prototype.setEncoding = function(encoding){} }


socket.on('connect', function(){
	socket.emit('web-client', {});
});
socket.on('disconnect', function(){ 
	// client.connected = false;
	// console.log('socket', client.connected)
});

socket.on('push-notification', function(noti) {

	if(Meteor.userId()) {
		let profile = Meteor.user().profile;
		let subject = ``, message = ``;
		let xIcon = {
      x16: `/64/${md5(noti.email)}`,
      x32: `/128/${md5(noti.email)}`
		}
		let admin = profile.level <= 1;
		
		if(noti.event == 'pushed' && noti.notify && (noti.permission.indexOf(profile.user_id) > -1 || noti.anonymous) || admin) {
			subject = `${noti.fullname} ${noti.event} (${noti.branch})`
			message = (noti.body || '').trim();

			// Update Dashboard
			Meteor.subscribe('dashboard');

			// Notification show.
			Push.create(subject, { body: message, icon: xIcon, timeout: 8000 });
		}

	}
});