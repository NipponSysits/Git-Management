var q = require('q');
var mysql = require('mysql');
var mysqlWrap = require('mysql-wrap');
var appconfig = require('configuration');
var pool = {};

console.log('configuration', appconfig.mysql_db);
module.exports = {
  connect: function(cn) {
    cn = cn || {};
    pool = mysql.createPool({
      connectionLimit: cn.connLimit || appconfig.mysql_db.connLimit || 10000,
      host: cn.host || appconfig.mysql_db.host || 'localhost',
      port: cn.port || appconfig.mysql_db.port || 3306,
      database: cn.database || appconfig.mysql_db.database || 'mysql',
      user: cn.user || appconfig.mysql_db.user || 'root',
      password: cn.password || appconfig.mysql_db.password || '',
      debug: cn.debug || appconfig.mysql_db.debug || false,
      supportBigNumbers: true,
      timezone:'+7:00',
      dateStrings:true,
      queryFormat: function (query, values) {
        if (!values) {
          return query;
        }
        return query.replace(/\:(\w+)/g, function (txt, key) {
          if (values.hasOwnProperty(key)) {
            return this.escape(values[key]);
          }
          return txt;
        }.bind(this));
      }
    });
    return mysqlWrap(pool);
  },
  pool: pool,
  pq: function(v) {
    return pool.escape(v);
  }
}
