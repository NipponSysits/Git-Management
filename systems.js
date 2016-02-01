var http = require('http'), engine = require('ejs-mate'), express = require('express'), app = express();
var q = require('q'), mysql = require('mysql'), walk = require('walk');
var bodyParser = require('body-parser'), cookieParser = require('cookie-parser')
var methods = require('methods');

var PrimaryKey = { key: 'T0UnO.K-Sentinel' };
var conn = require('./libs/db');

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
	req.access = req.cookies.ACCESS || '';
	req.isHtml = false;

	if(req.xhr && requested) { // LEVEL 1 
		req.XHRRequested = false;
		req.session = session;
		var decrypted = encryptor.decrypt(session);

		if((/(.+?)>\+</.exec(decrypted) || [])[1] === PrimaryKey.key) { // LEVEL 2
			var db = conn.connect({ database: 'ns_system' });
		  	db.select('sessions', { session_id: req.session }, function(err, row, field){ //LEVEL 3
		  		if(!err) {
		  			var whereTime = { yesterday: req.timestamp-Hour24, tomorrow:req.timestamp+Hour24, today:req.timestamp };
		  			var sqlSession = 'DELETE FROM sessions ' +
		  				'WHERE created_at <= :yesterday OR created_at >= :tomorrow OR (expire_at < :today AND expire_at > 0)';
		  			q.all([
			  			db.insert('requested', { access_id: req.access, request_id: req.headers['x-requested'], created_at: req.timestamp }),
			  			db.update('sessions', { expire_at: req.expire }, { access_id: req.access, session_id: req.session, email: null }),
			  			db.query('DELETE FROM requested WHERE created_at <= :yesterday OR created_at >= :tomorrow ', whereTime),  // LEVEL 4
			  			db.query(sqlSession, whereTime)
		  			]).then(function(){
		  				db.end();
		  				req.XHRRequested = true;
		  				next();
		  			}).catch(function(ex){
		  				db.end();
		  				console.log(ex);
		  				req.XHRRequested = false;
		  				next();
		  			});
		  		}
			});
		}
	} else {
		if(!session) {
			req.isHtml = true;
			req.session = encryptor.encrypt(PrimaryKey.key+'>+<'+req.timestamp.toString());
		}
		next();
	}

}

app.api = function(path, callback){
	console.log('API:', path);
	app.post(path, [ cookieParser(), SessionClient, bodyParser.json(), bodyParser.urlencoded()], function(req, res){
		if(req.XHRRequested) {
			res.error = function(data, title, message){ res.send({ onError: true, exTitle: title || "", onMessage: message || "", getItems: data || {} }) }
			res.success = function(data, title, message){ res.send({ onError: false, exTitle: title || "", onMessage: message || "", getItems: data || {} }) }
			callback(req, res, req.body);
		} else {
			res.status(404).send('Not found');
		}
	});
}

// app.html = function(path, render_name){
// 	console.log('HTML:', path);
// 	app.trace(path, [ cookieParser(), SessionClient ], function(req, res){
// 		if(req.XHRRequested) {
// 			res.render(render_name);
// 		} else {
// 			res.status(404).send('Not found');
// 		}
// 	});
// }

// // HTML Router
// walk.walk('html\\component', { followLinks: false }).on('file', function(root, stat, next) {
// 	root = root.replace(/\\component/, '');
//     var file = /(.*)\.ejs$/.exec(stat.name);
//     if(file) app.html(root.replace(/\\/ig, '/')+'/'+file[1], root+'\\'+file[1])
//     next();
// });

// API Router
walk.walk('api', { followLinks: false }).on('file', function(root, stat, next) {
	root = '\\'+root;
    var file = /(.*)\.js$/.exec(stat.name);
    if(file) app.api(root.replace(/\\/ig, '/')+'/'+file[1], require(__dirname+root+'\\'+stat.name))
    next();
});


app.get('*', [ cookieParser(), SessionClient ], function(req, res) {
	var libs = /\/libs\//.exec(req.pathname);
	var html = /\/html\//.exec(req.pathname);
	if(!libs && !html) {
		var db = conn.connect({ database: 'ns_system' });
		var where = { access_id: req.access, session_id: req.session, today: req.timestamp };
	  	db.query('SELECT session_id FROM sessions WHERE session_id = :session_id', where, function(err, row, field){
	  		if((row || []).length == 0) {
	  			var data = { access_id: 'UNKNOW', session_id: req.session, email: null, expire_at: 0, created_at: req.timestamp };
	  			db.insert('sessions', data, function(){ db.end(); });
	  		}
	  		console.log('INDEX', (row || []).length == 0);
	  		res.render('index', { 
	  			_LANG: language, 
	  			_HOST: config.ip+':'+config.port, 
	  			_SESSION : { 
	  				ID: (row || []).length == 0 ? req.session : undefined , 
	  				NAME: (err || {}).name != undefined ? err.name : "", 
	  				MESSAGE: (err || {}).message != undefined ? '('+err.statusCode+') '+err.code+' - '+err.message : "" 
	  			}
	  		});
		});
	} else if(html) {
		res.render('component/'+req.pathname.replace(/\/html\//, ''));
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

