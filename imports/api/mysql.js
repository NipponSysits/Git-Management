import { Meteor } from 'meteor/meteor';

const Q 				= require('q');
const mysql 		= require('mysql');
const mysqlWrap = require('mysql-wrap');
const config 		= require('$custom/config');
const pool      = mysql.createPool({
  connectionLimit: config.mysql.connLimit || 10000,
  host: config.mysql.host || 'localhost',
  port: config.mysql.port || 3306,
  database: config.mysql.database || 'mysql',
  user: config.mysql.user || 'root',
  password: config.mysql.password || '',
  debug: config.mysql.debug || false,
  supportBigNumbers: true,
  timezone:'+7:00',
  dateStrings:true,
  queryFormat: function (query, values) {
    if (!values) return query;
    return query.replace(/\:(\w+)/g, function (txt, key) {
      if (values.hasOwnProperty(key)) return this.escape(values[key]);
      return txt;
    }.bind(this));
  }
});
let db = mysqlWrap(pool);

module.exports = {
  select: Meteor.wrapAsync(function(table, whereEqualsObject, callback) {
    db.select(table, whereEqualsObject, function(err, result){
      callback(err, result);
    });
  }),
  query: Meteor.wrapAsync(function(sqlStatement, values, callback) {
    db.query(sqlStatement, values, function(err, result){
      callback(err, result);
    });
  }),
  one: Meteor.wrapAsync(function(sqlStatement, values, callback) {
    db.one(sqlStatement, values, function(err, result){
      callback(err, result);
    });
  }),
  save: Meteor.wrapAsync(function(table, insertObject, callback) {
    db.save(table, insertObject, function(err, result){
      callback(err, result);
    });
  }),
  update: Meteor.wrapAsync(function(sql, param = {}, callback) {
    db.update(table, setValues, whereEqualsObject, function(err, result){
      callback(err, result);
    });
  }),
  delete: Meteor.wrapAsync(function(table, whereEqualsObject, callback) {
    db.delete(table, whereEqualsObject, function(err, result){
      callback(err, result);
    });
  })
}

