var http = require('http'), engine = require('ejs-mate'), express = require('express'), app = express();
var q = require('q'), mysql = require('mysql'), walk = require('walk');
var bodyParser = require('body-parser')

var PrimaryKey = { key: 'T0UnO.K-Sentinel' };
var conn = require('./library/db');

app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', __dirname+'/html');
app.set('view options', { layout:false, root: __dirname + '/html' } );
app.use("/libs", express.static(__dirname+'/includes'));

var user = {};
var config = require('configuration');
var language = require('./language/'+(user.language || 'en-EN'));

var crypto = require('crypto').createHmac('sha256', PrimaryKey.key);
var encryptor = require('simple-encryptor')(PrimaryKey.key);

var SessionClient = function(req, res, next){
	var onTimestamp = Date.now();
	var onExpire = 86400000 + onTimestamp;
	var session = (req.headers['x-session-client'] || 'null') === 'null' ? null : req.headers['x-session-client'];
	var requested = req.headers['x-requested'] != undefined && req.headers['x-session-client'] != undefined;

	req.timestamp = onTimestamp;
	req.expire = onExpire;
	req.XHRRequested = req.xhr && requested;

	if(req.xhr && requested) { 
		req.session = session;
		var decrypted = encryptor.decrypt(session);

		console.log('decrypted', /(.+?)>\+</.exec(decrypted));
		next();
	}

	if(!session) {
		//var hash = crypto.update(onTimestamp.toString()).digest('hex');
		var encrypted = encryptor.encrypt(PrimaryKey.key+'>+<'+onTimestamp.toString());
		req.session = encrypted;
		next();
	}
}

app.api = function(path, callback){
	console.log('API:', path);
	app.post(path, [ SessionClient, bodyParser.json(), bodyParser.urlencoded() ], function(req, res){
		if(req.XHRRequested) {
			res.error = function(data, title, message){
				res.send({ onError: true, exTitle: title || "", onMessage: message || "", getItems: data })
			}
			callback(req, res, req.body);
		} else {
			res.code(404);
		}
		//res.end();
	});
}


walk.walk('api', { followLinks: false }).on('file', function(root, stat, next) {
	root = '\\'+root;
    var file = /(.*)\.js$/.exec(stat.name);
    if(file) app.api(root.replace(/\\/ig, '/')+'/'+file[1], require(__dirname+root+'\\'+stat.name))
    next();
});

app.get('*', [ SessionClient ], function(req, res) {
	var db = conn.connect();
  	var $scope = {};
  	db.select('sys_sessions', { session_id: req.session }, function(err, row, field){
  		if(row.length == 0) db.insert('sys_sessions', { session_id: req.session, email: null, expire_at: (10 * 60 * 1000) + req.timestamp });
  		res.render('index', { _LANG: language, _HOST: config.ip+':'+config.port, _SESSION_ : req.session });
	});
});

module.exports = {
	config: config,
	Run: function(){
		http.createServer(app).listen(config.port, config.ip, function() {
		    console.log((new Date()) + ' Server is listening on port ' + config.port);
		});
	}
}

