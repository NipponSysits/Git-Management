var conn = require('../libs/db');

module.exports = function(req, res, data){
	var db = conn.connect({ database: 'ns_system' });

	var Login = function(){
		db.delete('sessions', { access_id: 'UNKNOW' });
  		return db.selectOne('sessions', { email: data.email, access_id: req.access, session_id: req.session }, function(err, emailRow, field){
	  		db.end();
	  		console.log('access', (emailRow ? true : false ),{ email: data.email }, { access_id: req.access.substr(0, 10) }, { session_id: req.session.substr(0, 10) });
			res.success({ access: emailRow ? true : false });
		});
	}

	db.update('sessions', { access_id: req.access }, { session_id: req.session }, function(err, accessRow, field){
		if(accessRow.affectedRows == 0) {
			db.insert('sessions', { access_id: req.access, session_id: req.session, expire_at: 0, created_at: req.timestamp }, function(err, rows, field){
				console.log(err);
				Login();
			});
		} else {
	  		Login();
		}
	});
}