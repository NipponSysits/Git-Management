var conn = require('../libs/db');

module.exports = function(req, res, data){
	var ns = conn.connect();
	var access = { 
		name: false, 
		pass: false,
		user: null
	};
	var table = { table: 'user', fields: ['name', 'surname', 'password' ] };
  	ns.selectOne(table, { email: data.email }, function(err, row, field){ //LEVEL 3
  		// if(row) { // Usernamne found
		access.name = (row ? true : false);
		ns.selectOne('user_access', { email: data.email }, function(err, user, field){
  			ns.end();
			if(user) {
				if(row.password === data.password) {
					user.id = null;
					access.user = user;
					access.pass = true;
					var db = conn.connect({ database: 'ns_system' });
						db.update('sessions', { email: data.email, expire_at: req.expire }, { session_id: req.session, access_id: req.access }, function(){ 
		  				db.end(); 
		  			});
				}

			}
  			if(access.name && access.pass) res.success(access); else res.error(access);
		});
  		// }
	});
};