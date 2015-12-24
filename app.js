var express = require('express'), http = require('http'), rewrite = require("connect-url-rewrite"), ejs = require('ejs'), app = express();
var mongo = require('mongodb'), monk = require('monk');
app.set('view engine', 'ejs');
app.set('views', __dirname+'/html');
app.set('view options', { layout:false, root: __dirname + '/html' } );
app.use("/libs", express.static(__dirname+'/includes'));

var configKey = 'serv';
process.argv.forEach(function(params) {
	var item = /--(\w+)/.exec('--dev');
	if(item) configKey = item[1];
});

var config = require("./app.config")[configKey];
var db = monk(config.mongo_db.doamin+':'+config.mongo_db.port+'/'+config.mongo_db.dbname, config.mongo_db.access);
app.use('*', function(req, res, next){ 
	req.db = db; next(); 
});

app.get('*', function(req, res){	
    var db = req.db, com = req.params.com;
    var user = {};
    res.render('index', {
		_LANG: require('./language/'+(user.language || 'en-EN')),
		_HOST: config.ip+':'+config.port
	});
});


http.createServer(app).listen(config.port, config.ip, function() {
    console.log((new Date()) + ' Server is listening on port ' + config.port);
});
