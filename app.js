var systems = require('./modules/systems');
var config = systems.config;
//var db = monk(config.mongo_db.doamin+':'+config.mongo_db.port+'/'+config.mongo_db.dbname, config.mongo_db.access);

process.title = "touno-k.noip.me:"+config.port;
systems.options = {
	_MENU: require('./modules/component')
}

systems.Run();