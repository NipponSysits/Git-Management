
var crypto = require('crypto');
var text = 'T0UnO.K';


module.exports = function(req, res, data){

	var hash = crypto.createHmac('sha256', text).update('password').digest('hex');
	console.log(hash);
	console.log(req.body);
	res.send({ a: 'b'});
}