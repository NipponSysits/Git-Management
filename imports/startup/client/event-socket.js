const Q         = require('q');
const md5      	= require('md5');
const Push      = require('push.js');
const config		= process.env.METEOR_CONFIG == 'default' ? 'http://local-sentinel:811' : 'http://localhost:8200';
const socket  	= require('socket.io-client')(config);

// Fixed bug repository for other socket.
import Response from 'meteor-node-stubs/node_modules/http-browserify/lib/response';
if(!Response.prototype.setEncoding) { Response.prototype.setEncoding = function(encoding){} }


socket.on('connect', function(){
	socket.emit('web-client', {});

	// check notification allow permission
	
	// client.connected = true;
	// console.log('socket', client.connected)
});
socket.on('disconnect', function(){ 
	// client.connected = false;
	// console.log('socket', client.connected)
});

socket.on('push-notification', function(noti) {
	console.log('notification', noti);

	Push.create(`${noti.fullname} ${noti.event}`, {
	    body: noti.body.substr(0, 100),
	    icon: {
	        x16: `/16/${md5(noti.email)}`,
	        x32: `/32/${md5(noti.email)}`
	    }, 
	    timeout: 5000
	});
});