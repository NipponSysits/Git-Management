var http = require('http'), mongo = require('mongodb'), monk = require('monk');
var engine = require('ejs-mate'), express = require('express'), app = express();
var q = require('q');
var mysql = require('mysql');
var walk    = require('walk');

app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', __dirname+'/html');
app.set('view options', { layout:false, root: __dirname + '/html' } );
app.use("/libs", express.static(__dirname+'/includes'));

var user = {};
var config = require("./app.config")[/--(\w+)/.exec(process.argv[2] || '--serv')[1]];
var language = require('./language/'+(user.language || 'en-EN'));

app.get('*', [ SessionClient ], function(req, res){
    res.render('index', { 
    	_LANG: language, _HOST: config.ip+':'+config.port
     });
});

var conn = mysql.createConnection(config.mysql_db);

var SessionClient = function(req, res, next){
	if(req.xhr) {
		// Check Session id in db.
		// if not exists creacted session and send back
		// 
		var session = (req.headers['session-client'] || 'null') === 'null' ? null : req.headers['session-client'];
		console.log('check session in db', session);
		if(session) {
			req.sessionId = null;
		}
	} else {
		// check session and update date time
	}
	next();
}

var dbConnected = function(req, res, next){
	// conn.connect(function(err) {
	// 	conn.end();
	// 	// if (err) {
	// 	// 	res.send({ onError: true, exTitle: "MySql Connecting..", exMessage: err.stack.replace(/\n/ig, "<br>")});
	// 	// }
	// 	next();
	// });
	next();
}

walk.walk('\\modules', { followLinks: false }).on('file', function(root, stat, next) {
    var file = /(.*)\.js$/.exec(stat.name);
    if(file) app.post(root.replace(/\\/ig, '/').replace('/modules', '/api')+'/'+file[1], require(__dirname+root+'\\'+stat.name))
    next();
});

app.post('/api/sign-in', [ SessionClient, dbConnected ], function(req, res){
	// SignIn
	console.log(req.route.path, req.xhr);
    res.send({ status: true });
});

module.exports = {
	config: config,
	Run: function(){
		http.createServer(app).listen(config.port, config.ip, function() {
		    console.log((new Date()) + ' Server is listening on port ' + config.port);
		});
	}
}

