var conn = require('../libs/db');

module.exports = function(req, res, data){
	var db = conn.connect({ database: 'ns_system' });
	db.update('sessions', { access_id: req.access }, { session_id: req.session }, function(err, accessRow, field){
  		db.delete('sessions', { access_id: 'UNKNOW' });
  		db.selectOne('sessions', { email: data.email, access_id: req.access, session_id: req.session }, function(err, emailRow, field){
	  		db.end();
	  		console.log('access', { email: data.email }, { access_id: req.access.substr(1, 5) }, { session_id: req.session.substr(1, 5) });
			res.success({ access: emailRow ? true : false, found: accessRow.affectedRows > 0 });
		});
	});
}