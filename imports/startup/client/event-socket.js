const Q         = require('q');
const Push      = require('push.js');
const socket  	= require('socket.io-client')('http://192.168.10.6:8200');

import Response from 'meteor-node-stubs/node_modules/http-browserify/lib/response';

if(!Response.prototype.setEncoding) { Response.prototype.setEncoding = function(encoding){} }

socket.on('connect', function(){
	// client.connected = true;
	console.log('socket', client.connected)
});
socket.on('disconnect', function(){ 
	// client.connected = false;
	console.log('socket', client.connected)
});

socket.on('push-notification', function(noti) {
	console.log('notification', noti);

	Push.create(`${noti.fullname} ${noti.event}`, {
	    body: noti.body,
	    // icon: {
	    //     x16: 'images/icon-x16.png',
	    //     x32: 'images/icon-x32.png'
	    // }, 
	    timeout: 5000
	});
});