var conn = require('../libs/db');

module.exports = function(req, res, data){
	var db = conn.connect();

	var Login = function(){
		db.delete('sessions', { access_id: 'UNKNOW' });
		db.selectOne('sessions', { email: data.email, access_id: req.access, session_id: req.session }, function(err, emailRow, field){
  		console.log('access', (emailRow ? true : false ),{ email: data.email }, { access_id: req.access.substr(0, 10) }, { session_id: req.session.substr(0, 10) });
			db.selectOne('user_access', { email: data.email }, function(err, user, field){
				db.end();
				user = user || {};
				user.id = null;
				res.success({ access: emailRow ? true : false, user: user });
			});
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