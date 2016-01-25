var conn = require('../library/db');

module.exports = function(req, res, data){
	var db = conn.connect();
  	db.selectOne('sys_sessions', { email: data.email }, function(err, row, field){ //LEVEL 3
  		if(row) { // Usernamne found
			res.success({ access_again: true });
  		} else {
  			res.succeess({ access_again: false });
  		}
	});
}