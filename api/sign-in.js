var conn = require('../library/db');

module.exports = function(req, res, data){
	var ns = conn.connect();
	var user = { 
		name: false, 
		pass: false,
		display: '',
		email: data.email
	};
	var table = { table: 'user', fields: ['name', 'surname', 'password' ] };
  	ns.selectOne(table, { email: data.email }, function(err, row, field){ //LEVEL 3
  		if(row) { // Usernamne found
  			user.name = true;
  			if(row.password === data.password) {
  				user.pass = true;
  				user.display = row.name + ' ' + row.surname;
				var db = conn.connect({ database: 'ns_system' });
	  			db.delete('sessions', { email: data.email }, function(){
	  				db.update('sessions', { email: data.email, expire_at: req.expire }, { session_id: req.session });
	  			});
	  			
  			}
  		}
  		if(user.name && user.pass) res.success(user); else res.error(user);
	});
};