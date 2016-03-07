module.exports = function(name, req, res, state) {
	var q = require('q');
	var conn = require('../../../libs/db');
	var db = conn.connect();
	var sql = "select p.name project_name, r.name, r.description, anonymous, logo " +
	"from repository r " +
	"left join repository_project p ON r.project_id = p.project_id " +
	"where (user_id = :user_id and collection_id is null ) or collection_id = :collection_id " +
	"ORDER BY p.name asc, r.name asc";


	db.query(sql, req.body).then(function(row) {
		res.render(name, { ITEM: row });
	}).catch(function() {
		res.render('catch');
	});
	
}