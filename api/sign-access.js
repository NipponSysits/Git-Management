var conn = require('../libs/db');

module.exports = function(req, res, data){
	var db = conn.connect({ database: 'ns_system' });
	db.update('sessions', { access_id: req.access }, { session_id: req.session }, function(err, accessRow, field){
	  	db.selectOne('sessions', { email: data.email }, function(err, emailRow, field){ //LEVEL 3
	  		db.end();
	  		console.log('accessRow', { email: data.email }, { access_id: req.access }, { session_id: req.session });
			res.success({ access: emailRow ? true : false, found: accessRow.affectedRows > 0 });
		});
	});
}