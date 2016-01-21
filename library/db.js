var q = require('q');
var mysql = require('mysql');
var mysqlWrap = require('mysql-wrap');
var appconfig = require('configuration');

console.log('configuration', appconfig.mysql_db);

var pool = mysql.createPool({
  connectionLimit: appconfig.mysql_db.connLimit || 100,
  host: appconfig.mysql_db.host || 'localhost',
  port: appconfig.mysql_db.port || 3306,
  database: appconfig.mysql_db.database || 'mysql',
  user: appconfig.mysql_db.user || 'root',
  password: appconfig.mysql_db.password || '',
  debug: appconfig.mysql_db.debug || false,
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

module.exports = {
  connect: function() {
    return mysqlWrap(pool);
  },
  getPool: function() {
    return pool;
  },
  pq: function(v) {
    return pool.escape(v);
  },
  toArray: function(rows, fields) {
    if (rows.length==0) {
      return {f:fields,d:[]}
    }
    return {f:fields,d:rows.map(function(row) {
      var tmp = [];
      for (i in row) {
        tmp.push(row[i]);
      }
      return tmp;
    })}
  },

  genValues: function(data, flds) {
    var tmp = [];
    var n = 0;
    flds.forEach(function(fld) {
      if (fld.type=='number') {
        n = parseFloat(data[fld.name]);
        tmp.push(isNaN(n) ? '0' : ''+n);
      } else if (fld.type=='fnc') {
        tmp.push(data[fld.name] || 'NULL');
      } else {
        tmp.push(data[fld] ? pool.escape(data[fld]) : "''");
      }
    });
    return "(" + tmp.join(",") + ")";
  },

  genUpdate: function(table, flds, data, prevData) {
    var tmp = [];
    var param = {};
    flds.forEach(function(fld) {
      var ok = false;
      if (typeof prevData === 'undefined' || typeof prevData[fld]==='undefined') {
        if (typeof data[fld] != 'undefined') {
          ok = true;
        }
      } else if (typeof data[fld] != 'undefined') {
        if (data[fld] != prevData[fld]) {
          ok = true;
        }
      }
      if (ok) {
        tmp.push('`' + fld + '`=:' + fld);
        param[fld] = data[fld];
      }
    });
//    console.log('tmp=', tmp);
    if (tmp.length == 0) {
      return false;
    }
    return {
      sql:"UPDATE " + table + " SET " + tmp.join(', '),
      param:param
    };
  }
}
