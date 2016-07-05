const Q         = require('q');
const Push      = require('push.js');
const db        = Mysql.connect(config.mysql);
const socket    = require('$custom/sentinel').clent;

socket.on('push-notification', function(noti) {
	Push.create(`${noti.fullname} ${noti.event}`, {
	    body: noti.body,
	    // icon: {
	    //     x16: 'images/icon-x16.png',
	    //     x32: 'images/icon-x32.png'
	    // },
	    timeout: 5000
	});
});