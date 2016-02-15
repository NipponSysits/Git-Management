module.exports = function(name, req, res, state) {
	var q = require('q');
	var conn = require('../../libs/db');

	var db = conn.connect();
	db.query('select * from repositories order by name').then(function(row) {
		res.render(name, { ITEM: row });
	}).catch(function() {
		res.render('catch');
	});
	
}