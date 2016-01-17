var http = require('http'), mongo = require('mongodb'), monk = require('monk');
var engine = require('ejs-mate'), express = require('express'), app = express();

app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', __dirname+'/../html');
app.set('view options', { layout:false, root: __dirname + '/html' } );
app.use("/libs", express.static(__dirname+'/../includes'));

var user = {};
var config = require("./../app.config")[/--(\w+)/.exec(process.argv[2] || '--serv')[1]];
var language = require('./../language/'+(user.language || 'en-EN'));

app.get('*', function(req, res){	
    res.render('index', { 
    	_LANG: language, _HOST: config.ip+':'+config.port
     });
});

app.use('*', function(req, res, next){
	if(req.xhr) {
		var session = (req.headers['session-client'] || 'null') === 'null' ? null : req.headers['session-client'];
		console.log('check session in db', session);
		if(session) {
			
		}
	}
	next();
});

app.post('/api/sign-init', function(req, res){
	// var session
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

