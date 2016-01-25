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

var SQLError = function(err){ err = err || {}; return { name: err.name, message: (err != null ? '('+err.statusCode+') '+err.code+' - '+err.message : "")};  }

var SessionClient = function(req, res, next){
	var onTimestamp = Date.now();
	var Hour24 = 86400000; // milisecond
	var onExpire = Math.round(Hour24 / 4) + onTimestamp;
	var session = (req.headers['x-session-client'] || 'null') === 'null' ? null : req.headers['x-session-client'];
	var requested = req.headers['x-requested'] != undefined && req.headers['x-session-client'] != undefined;

	req.timestamp = onTimestamp;
	req.expire = onExpire;
	req.XHRRequested = req.xhr && requested;
	req.pathname = req._parsedUrl.pathname;

	if(req.xhr && requested) { // LEVEL 1 
		req.XHRRequested = false;
		req.session = session;
		var decrypted = encryptor.decrypt(session);
		if((/(.+?)>\+</.exec(decrypted) || [])[1] === PrimaryKey.key) { // LEVEL 2
			var db = conn.connect();
		  	db.select('sys_sessions', { session_id: req.session }, function(err, row, field){ //LEVEL 3
		  		if(!err) {
		  			var whereTime = { yesterday: onTimestamp-Hour24, tomorrow:onTimestamp+Hour24, today:onTimestamp };
		  			var sqlSession = 'DELETE FROM sys_sessions ' +
		  				'WHERE created_at <= :yesterday OR created_at >= :tomorrow OR (expire_at < :today AND expire_at > 0)';
		  			q.all([
			  			db.insert('sys_requested', { request_id: req.headers['x-requested'], created_at: req.timestamp }),
			  			db.update('sys_sessions', { session_id: req.session }, { created_at: req.timestamp }),
			  			db.query('DELETE FROM sys_requested WHERE created_at <= :yesterday OR created_at >= :tomorrow ', whereTime),  // LEVEL 4
			  			db.query(sqlSession, whereTime)
		  			]).then(function(){
		  				req.XHRRequested = true;
		  				next();
		  			});
		  		}
			});
		}
	} else {
		if(!session) req.session = encryptor.encrypt(PrimaryKey.key+'>+<'+onTimestamp.toString());
		next();
	}
}

app.api = function(path, callback){
	console.log('API:', path);
	app.post(path, [ SessionClient, bodyParser.json(), bodyParser.urlencoded() ], function(req, res){
		console.log('XHRRequested', req.XHRRequested);
		if(req.XHRRequested) {
			res.error = function(data, title, message){ res.send({ onError: true, exTitle: title || "", onMessage: message || "", getItems: data }) }
			res.success = function(data, title, message){ res.send({ onError: false, exTitle: title || "", onMessage: message || "", getItems: data }) }
			callback(req, res, req.body);
		} else {
			res.status(404).send('Not found');
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
	var libs = /\/libs\//.exec(req.pathname);
	if(!libs) {
		var ip = req.headers['x-forwarded-for'] || 
		     req.connection.remoteAddress || 
		     req.socket.remoteAddress ||
		     req.connection.socket.remoteAddress;
		console.log(ip);
		var db = conn.connect();
	  	db.select('sys_sessions', { session_id: req.session }, function(err, row, field){
	  		if((row || []).length == 0) db.insert('sys_sessions', { session_id: req.session, email: null, expire_at: 0, created_at: req.timestamp });
	  		var name = ((err || {}).name != undefined ? err.name : "");
	  		var message = ((err || {}).message != undefined ? '('+err.statusCode+') '+err.code+' - '+err.message : "");
	  		res.render('index', { 
	  			_LANG: language, 
	  			_HOST: config.ip+':'+config.port, 
	  			_SESSION : { ID: req.session, NAME: name, MESSAGE: message }
	  		});
		});
	} else {
		res.status(404).send('Not found');
	}
});

module.exports = {
	config: config,
	Run: function(){
		http.createServer(app).listen(config.port, config.ip, function() {
		    console.log((new Date()) + ' Server is listening on port ' + config.port);
		});
	}
}

