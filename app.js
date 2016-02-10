var systems = require('./systems');
var config = systems.config;
//var db = monk(config.mongo_db.doamin+':'+config.mongo_db.port+'/'+config.mongo_db.dbname, config.mongo_db.access);

process.title = "pgm.ns.co.th:"+config.port;

systems.Run();