import { Meteor } from 'meteor/meteor';
import { Session }  from 'meteor/session';


import '../imports/startup/client';

const md5 		= require('md5');
const Q 			= require('q');

let SignalConnected = true;

const IdSignal = Meteor.setInterval(function(){
	let io = Meteor.status();
	if(SignalConnected != io.connected) {
		if(io.connected) {
			// hide preload
		} else {
			// show preload
		}
		SignalConnected = io.connected;
	}
}, 3000);


$.fn.extend({
  avatar: function(email, size) {

    size = size || 256;
    var url = '//www.gravatar.com/avatar'+(email ? '/'+md5(email) : '')+'?d=mm&s='+size;
    return $(this).css('background-image',"url('"+url+"')");
  }
});

window.T = {
	Call : function(name, param){
		let def = Q.defer();
	  let result = Meteor.subscribe(name, param, function(data) {
	  	console.log(result, data) ;
	    if(result) {
	    	// result[0]
	    	def.resolve(result);
	    } else {
	    	def.resolve();
	    }
	  });
    return def.promise;
	},
	Init:function(timestamp){
		let def = Q.defer();
  	if(timestamp != undefined) {
  		Session.set('ACCESS_TIME', timestamp); 
	    if(!T.Storage('SESSION_CLIENT')) {
	      $.getScript("//l2.io/ip.js?var=myip", function() { 
	      	T.Storage('SESSION_CLIENT', md5(myip).toUpperCase()); 
	      	def.resolve(true); 
	      });
	    } else {
	      def.resolve(true);
	    }
	  } else {
	  	def.resolve(true);
	  }

    return def.promise;
	},
	Timestamp : parseInt((new Date().getTime() / 1000)),
	Storage: function(key, setValue) {
		var getValue = null;
		try {
			if(typeof setValue === 'undefined') {
				getValue = window.localStorage.getItem(key);
				try { getValue = JSON.parse(getValue); } catch (e) { }
			} else if (typeof setValue === 'object') {
				setValue = JSON.stringify(setValue);
				window.localStorage.setItem(key, setValue.toString());
			} else {
				window.localStorage.setItem(key, setValue);
			}
		} catch (e) { console.log('catch', e);/* Browser not support localStorage function. */ }
		return getValue;
	},
	StorageClear: function(key){
		try {
			if(key == undefined) {
				$.each(window.localStorage, function(key,value){ window.localStorage.removeItem(key); }); 
			} else {
				localStorage.removeItem(key);
			}
		} catch (e) { /* Browser not support localStorage function. */ }
	}
}
