var http = require('http'), engine = require('ejs-mate'), express = require('express'), app = express();
var q = require('q'), mysql = require('mysql'), walk = require('walk');
var bodyParser = require('body-parser')


app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', __dirname+'/html');
app.set('view options', { layout:false, root: __dirname + '/html' } );
app.use("/libs", express.static(__dirname+'/includes'));

var user = {};
var config = require('configuration');
var language = require('./language/'+(user.language || 'en-EN'));


var SessionClient = function(req, res, next){

	var session = (req.headers['session-client'] || 'null') === 'null' ? null : req.headers['session-client'];
	console.log('check session in db', session);
	if(!session) {

		req.sessionId = '';

	}

	if(req.xhr) { 

	}

	next();
}

app.api = function(path, callback){
	console.log('API:', path);
	app.post(path, [ SessionClient, bodyParser.json(), bodyParser.urlencoded() ], function(req, res){
		callback(req, res, req.body);
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
    res.render('index', { 
    	_LANG: language, _HOST: config.ip+':'+config.port
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

