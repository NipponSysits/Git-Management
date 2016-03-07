  $.fn.avatar = function(email, size){
    size = size || 256;
    var url = 'http://www.gravatar.com/avatar/'+md5(email || 'none')+'?d=mm&s='+size;
    return $(this).css('background-image',"url('"+url+"')");
  }


$.extend(window, {
  CallbackException : function(m1, m2) {
    m1 = m1 || {};
    this.onError = m1.onError || false;
    this.exTitle = m1.exTitle || ((m2!=undefined) ? m1 : undefined) || "Exception";
    this.exMessage = m1.exMessage || m2 || "";
    this.getItems = m1.getItems || {};
    try{
      if(m1.getItems != undefined) this.getItems = jQuery.parseJSON(this.getItems);
    } catch(e) { }
    this.toString = function(){ return this.exTitle + ' >>> ' + this.exMessage; }
  },
  Performance : function(funcName) {
    var EnablePerformance = performance != undefined && MBOS.Browser.Chrome;
    var BeginTime = 0.0, ElapsedTime = 0.0, FinishTime = 0.0;
    var func_name = funcName || "Performance"
    this.Start = function(){
      if(EnablePerformance) {
        var time = new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds();
        BeginTime = performance.now();
        ElapsedTime = BeginTime;
        if(typeof console != 'undefined') console.log(func_name + "() Performance >>> Starting on " + time);
      }
    }
    this.Check = function(msg){
      if(EnablePerformance) {
        var now = performance.now();
        if(typeof console != 'undefined') console.log((msg == undefined ? func_name + "() elapsed time is" : msg) + "\n\r", (now - ElapsedTime), "ms");
        ElapsedTime = now;
      }
    }
    this.Stop = function(msg){
      if(EnablePerformance) {
				var time = new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds();
				var now = performance.now();
				FinishTime = now;
				if(typeof console != 'undefined') console.log((msg == undefined ? func_name + "() elapsedtime is" : msg) + "\n\r", (now - ElapsedTime) , "ms (" + ((FinishTime - BeginTime) / 1000).toFixed(2) + " s)");
				if(typeof console != 'undefined') console.log(func_name + "() Performance >>> Stoped on " + time);
				ElapsedTime = performance.now();
      }
    }
    this.toString = function(){ return  func_name + "() elapsedtime is " + ((FinishTime - BeginTime) / 1000).toFixed(2) + " s"; }
  },
  exModal: function(ex) {
    var uiEX = '.ui.modal.feature-exception';
    $('.ui.dimmer.prepare').hide();
    $(uiEX).modal({ closable: false, duration: 0 });
    $('.ui.button.refresh-exception').click(function(){
      location.reload();
    });

    if (ex instanceof CallbackException) {
      $(uiEX+' div.description>p').html(ex.exMessage);
      $(uiEX+' div.header').html(ex.exTitle);
    } else {
      $(uiEX+' div.description>p').html(ex);
      $(uiEX+' div.header').html("Exception fail.");
    }
    $(uiEX).modal('show');  
  }
//    alert : function(title, msg, cancel) {
//        if(title instanceof CallbackException) {
//            
//        } else {
//            
//        }
//    },
//    confirm : function(title, msg, yes, no) {
//        
//    },
});


window.T = {
	Timestamp : parseInt((new Date().getTime() / 1000)),
	Storage: function(key, setValue) {
		var getValue = null;
		try {
			if(typeof(setValue) === 'undefined') {
				getValue = window.localStorage.getItem(key);
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
	},
  Init: function(session){
    var aInit = $.Deferred();

    if(T.Storage('SESSION_CLIENT') == null) T.Storage('SESSION_CLIENT', session);
    $.ajaxSetup({
      dataType: 'JSON', type: 'POST',
      headers: { 'X-Requested-With': 'XMLHttpRequest', 'X-Session-Client': T.Storage('SESSION_CLIENT') || session }
    });

    if(!$.cookie('ACCESS')) {
      $.getScript( "http://l2.io/ip.js?var=myip", function() { $.cookie('ACCESS', md5(myip)); aInit.resolve({ init: true}); });
    } else {
      aInit.resolve({ init: true });
    }
    
    return aInit.promise();
  }
}
