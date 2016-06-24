import { Meteor } 	from 'meteor/meteor';
import { HTTP }     from 'meteor/http'

const config 		= require('$custom/config');
const mongo     = require('$custom/schema');
const Q         = require('q');
const $         = require('jquery');
const db        = Mysql.connect(config.mysql);
const socket    = require('$custom/sentinel').clent;

Meteor.publish('collection-add', function(data) {
  let self = this;
  // let data = { collection_name: "Test New", list: 99, collection_id: 99, user_id: null };
  self.added('list.collection-name', data.collection_id, data);
  self.ready();
});


Meteor.publish('collection-list', function() {
  // Meteor._sleepForMs(2000);
  let self = this;
  if(!self.userId) return [];
  let getUser = Meteor.users.findOne({ _id: self.userId });
  let UserProfile = getUser.profile;
  let programmer = UserProfile.role.level > 1 && UserProfile.role.level < 5;
  let project = UserProfile.role.level < 5;

  let query_collection = `
  SELECT p.name collection_name, LOWER(p.name) order_name, COUNT(p.collection_id) list, p.collection_id, NULL user_id
  FROM repository r
  LEFT JOIN repository_collection p ON r.collection_id = p.collection_id
  ${ !programmer?``:`
  LEFT JOIN repository_contributor c 
    ON c.repository_id = r.repository_id and c.permission in ('Contributors','Administrators')
  `}
  WHERE r.collection_id IS NOT NULL AND content_id IS NULL AND fork_id IS NULL
    ${ !programmer?``:`
    AND (c.user_id IS NULL OR (c.user_id IS NOT NULL AND c.user_id = ${UserProfile.user_id}))
    AND (c.user_id = ${UserProfile.user_id} OR r.anonymous = 'YES')
    AND (r.private = 'NO' OR (r.private = 'YES' AND r.user_id = ${UserProfile.user_id}))
    `}
  GROUP BY p.name, p.collection_id;
  `;

  let query_user = `
  SELECT u.username collection_name, LOWER(u.username) order_name, count(r.user_id) list, NULL collection_id, r.user_id 
  FROM repository r
  ${ !programmer?``:`
  LEFT JOIN repository_contributor c 
    ON c.repository_id = r.repository_id and c.permission in ('Contributors','Administrators')
    `}
  LEFT JOIN user u ON u.user_id = r.user_id
  WHERE r.collection_id IS NULL 
    AND content_id IS NULL AND fork_id IS NULL
    ${ !programmer?``:`
    AND (c.user_id IS NULL OR (c.user_id IS NOT NULL AND c.user_id = ${UserProfile.user_id}))
    AND (c.user_id = ${UserProfile.user_id} OR r.anonymous = 'YES')
    AND (r.private = 'NO' OR (r.private = 'YES' AND r.user_id = ${UserProfile.user_id}))
    `}
  GROUP BY u.username, r.user_id 
  `; // ${ !programmer?``:`OR p.collection_id IS NOT NULLs `  }


  db.query(query_collection, function(err, data){
  	if(err) self.error(err);
		(data || []).forEach(function(item){
      if(item.list > 0) {
        self.added('list.collection-name', item.collection_id, item);
      }
		});

    db.query(query_user, function(err, data){
      if(err) self.error(err);
      let ownerCreated = false;
      (data || []).forEach(function(item){
        if(item.list > 0) self.added('list.collection-user', item.user_id, item);
        if(item.collection_name == getUser.username) {
          ownerCreated = true;
        }
      });
      if(!ownerCreated && UserProfile.role.level < 4) {
        ownerCreated = { 
          collection_name: getUser.username, 
          list: 0, 
          collection_id: null, 
          user_id: UserProfile.user_id 
        }
        self.added('list.collection-user', UserProfile.user_id, ownerCreated);
      }
  		self.ready();
    });
  });
});

Meteor.publish('repository-list', function(collection) {
  let self = this;
  if(!self.userId) return [];

  let User = Meteor.users.findOne({ _id: self.userId });
  let collection_name = collection || User.username;
  let level = User.profile.role.level > 1;

  console.log('collection_name', collection_name, 'level:', level);
  let query = `
  SELECT 
    r.repository_id, r.collection_id, r.user_id, r.project_id, p.name project_name, LOWER(p.name) order_project,
    (CASE WHEN r.collection_id IS NOT NULL THEN co.name ELSE u.username END) collection_name, 
    u.username, r.name repository_name,
    (CASE WHEN r.fullname IS NULL THEN r.name ELSE r.fullname END) title_name, 
    LOWER(CASE WHEN r.fullname IS NULL THEN r.name ELSE r.fullname END) order_repository,
    r.description, r.private, r.anonymous, r.logo,    
    ua.username admin, r.updated_at
  FROM repository r
  LEFT JOIN user u ON u.user_id = r.user_id
  LEFT JOIN repository_project p ON r.project_id = p.project_id
  LEFT JOIN repository_collection co ON co.collection_id = r.collection_id
  LEFT JOIN repository_contributor ad 
    ON ad.repository_id = r.repository_id AND ad.permission in ('Administrators')
  LEFT JOIN user ua ON ua.user_id = ad.user_id
  ${ !level?``:`
  LEFT JOIN repository_contributor c 
    ON c.repository_id = r.repository_id AND c.permission in ('Contributors','Administrators')
  `}
  WHERE content_id IS NULL AND fork_id IS NULL
  ${ !level?``:`
  AND (c.user_id IS NULL OR (c.user_id IS NOT NULL AND c.user_id = ${User.profile.user_id}))
  AND (c.user_id = ${User.profile.user_id} OR r.anonymous = 'YES')
  AND (r.private = 'NO' OR (r.private = 'YES' AND r.user_id = ${User.profile.user_id}))
  `}
  AND (co.name = '${collection_name}' OR u.username = '${collection_name}')
  `;

  db.query(query, function(err, data){
  	if(err) self.error(err);

    (data || []).forEach(function(item){
      var findCommits = mongo.Commit.findOne({ repository_id: item.repository_id }).sort({since : -1});
      findCommits.exec(function(err, result){
        if(err) console.log(err);
        item.updated_at = (result || {}).since || item.updated_at;        
        self.added('list.repository', item.repository_id, item);
      });
    });
		self.ready();
  });
});

// const liveDbs 	s	= new LiveMysql(config.mysql);
Meteor.publish('repository-loaded', function(param){
  let summary = {
    collection: param.collection,
    repository: param.repository
  };
  let thread = [];
  let self = this;
  // db.collection_name, db.repository_name
  // console.log(param.collection, param.repository.replace(/\.git$/g,''));

  if(!self.userId) return [];

  let UserProfile = Meteor.users.findOne({ _id: self.userId }).profile;
  // let api = `http://${config.socket}:${config.api}/api/repository/files/${summary.collection}/${summary.repository}/master`;

  // var response = HTTP.get(api);
  // try { response = JSON.parse(response.content); } catch (e) { response = {} }

  // console.log(response);
  
  let getRepository = function(){
    let def = Q.defer();
    let query_loaded = `
    SELECT r.repository_id
    FROM repository r
    LEFT JOIN user u ON u.user_id = r.user_id
    LEFT JOIN repository_collection c ON c.collection_id = r.collection_id
    WHERE (c.name = '${summary.collection}' OR u.username = '${summary.collection}')
      AND r.name = '${summary.repository.replace(/\.git$/g,'')}'
    `;

    db.query(query_loaded, function(err, data){
      if(err || data.length == 0) {
        def.reject(err);
      } else {
        def.resolve(data[0]);
      }
    });
    return def.promise;
  }

  getRepository().then(function(data){
    // data.email = UserProfile.email;
    // console.log('getRepository', data);

    let def = Q.defer();
    let commits = mongo.Commit.find(data).count();
    commits.exec(function(err, logs){
      if(err) {
        def.reject(err);
      } else {
        summary.commits = logs;
        def.resolve(data);
      }
    });
    return def.promise;
  }).then(function(data){
    let def = Q.defer();
    let query_loaded = `
      SELECT COUNT(*) person 
      FROM repository_contributor 
      WHERE repository_id = ${data.repository_id}
    `;

    db.query(query_loaded, function(err, person){
      if(err || person.length == 0) {
        def.reject(err);
      } else {
        summary.contributor = person[0].person;
        def.resolve(data);
      }
    });
    return def.promise;
  }).then(function(data){
    let def = Q.defer();

    let api = `${config.socket}:${config.api}/api/repository/files`;

    // http.get(api, function (error, res) {
    //   console.log(res.code, res.headers, res.buffer.toString());
    // });
    // $.ajax({
    //   url: api,
    //   success: function(data){
    //     console.log(data);
    //     def.resolve(data);ss
    //   }
    // });
    // var response = HTTP.get(api, data);
    def.resolve(data);
    // if(socket.connected) {
    //   socket.emit('repository-get', data);
    // } else {
    //   summary.files = 0;
    //   def.resolve(data);
    // }
    return def.promise;
  }).then(function(data){
    self.added('summary.repository', data.repository_id, summary);

    let commits = mongo.Commit.find(data).sort({since : -1}).limit(13);
    commits.exec(function(err, logs){
      if(err) def.reject(err);

      logs.forEach(function(log){
        
        self.added('logs.repository', `${log.repository_id}_${log.commit_id}`, {
          logs: log.logs,
          collection: param.collection,
          repository: param.repository,
          author: log.author,
          email: log.email,
          since: log.since,
          subject: log.subject,
          comment: log.comment,
        });
      });
      self.ready();
    });

  }).catch(function(err){
    console.log('err', err);
    self.stop();
  });


});

socket.on('repository-file', function(files){
  console.log('repository-file', files);
  summary.files = files;
  def.resolve(data);
});


    //   // self.added('summary.repository', data[0], {

    //   // });

    //   self.ready();
    // });




// db.end(function(err) {
// 	console.log('The connection', err);
//   // The connection, table events and queries are terminated now
// });