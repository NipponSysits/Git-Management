var md5 = require('md5');
import '../imports/startup/client';

$.fn.extend({
  avatar: function(email, size) {
    size = size || 256;
    var url = '//www.gravatar.com/avatar/'+md5(email || 'none')+'?d=mm&s='+size;
    return $(this).css('background-image',"url('"+url+"')");
  }
});

window.T = {
	Call : function(name, param){
	  let result = new MysqlSubscription("allPlayers", param, function() { 
	    if(result[0]) {
	    	// result[0]
	    } else {
	    	// undefined
	    }
	  });
	},
	Timestamp : parseInt((new Date().getTime() / 1000)),
	Storage: function(key, setValue) {
		var getValue = null;
		try {
			if(typeof setValue === 'undefined') {
				getValue = window.localStorage.getItem(key);
				try { getValue = JSON.parse(getValue); } catch (e) { }
			} else if (typeof setValue === 'object') {
				getValue = JSON.stringify(setValue);
			} else {
				window.localStorage.setItem(key, setValue.toString());
			}
		} catch (e) { /* Browser not support localStorage function. */ }
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
