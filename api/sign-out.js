var conn = require('../libs/db');

module.exports = function(req, res, data){
	var db = conn.connect({ database: 'ns_system' });
	db.update('sessions', { email: null, expire_at: 0 }, { session_id: req.session, access_id: req.access }, function(err, row, field){
		console.log({ session_id: req.session, access_id: req.access });
		db.end(); 
		if(err) res.error(); else res.success();
	});
};