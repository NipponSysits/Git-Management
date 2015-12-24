var systems = require('./modules/systems');
var config = systems.config;
//var db = monk(config.mongo_db.doamin+':'+config.mongo_db.port+'/'+config.mongo_db.dbname, config.mongo_db.access);

var menu = [
    { name: "HOME", component:'', ejs: 'component/main' },
    { name: "PORTFOLIO", component:'portfolio', ejs:'component/portfolio' },
    { name: "PROFILE", component:'profile', ejs:'component/profile' },
];

systems.options ={
	_MENU: menu
}

menu.forEach(function(item) {
	systems.Component(item.component, item.ejs, systems.options);
});
systems.Run();