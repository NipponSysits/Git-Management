var conn = require('../library/db');

module.exports = function(req, res, data){
	var db = conn.connect();
	var user = { 
		name: false, 
		pass: false,
		display: '',
		email: data.email
	};
	var table = { table: 'users', fields: ['name', 'surname', 'password' ] };
  	db.selectOne(table, { email: data.email }, function(err, row, field){ //LEVEL 3
  		if(row) { // Usernamne found
  			user.name = true;
  			if(row.password === data.password) {
  				user.pass = true;
  				user.display = row.name + ' ' + row.surname;
	  			db.delete('sys_sessions', { email: data.email }, function(){
	  				db.update('sys_sessions', { email: data.email, expire_at: req.expire }, { session_id: req.session });
	  			});
	  			
  			}
  		}
  		if(user.name && user.pass) res.success(user); else res.error(user);
	});
};