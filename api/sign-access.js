var conn = require('../library/db');

module.exports = function(req, res, data){
	var db = conn.connect();
	db.update('sys_sessions', { access_id: req.access }, { session_id: req.session }).then(function(){
	  	db.selectOne('sys_sessions', { email: data.email }, function(err, row, field){ //LEVEL 3
	  		if(row) res.success({ access: true }); else	res.success({ access: false });
		});
	});

}