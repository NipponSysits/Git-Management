var conn = require('../library/db');

module.exports = function(req, res, data){
	var db = conn.connect();
	db.update('sys_sessions', { access_id: req.access }, { session_id: req.session }, function(err, accessRow, field){
	  	db.selectOne('sys_sessions', { email: data.email }, function(err, emailRow, field){ //LEVEL 3
	  		console.log('accessRow', { email: data.email }, { access_id: req.access }, { session_id: req.session });
			res.success({ access: emailRow ? true : false, found: accessRow.affectedRows > 0 });
		});
	});
}