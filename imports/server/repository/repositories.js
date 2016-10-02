import { Meteor } 	from 'meteor/meteor';
import { HTTP }     from 'meteor/http'

const config 		= require('$custom/config');
const mongo     = require('$custom/schema');
const Q         = require('q');


// Meteor.publish('collection-add', function(data) {
//   let self = this;
//   // let data = { collection_name: "Test New", list: 99, collection_id: 99, user_id: null };
//   self.added('list.collection-name', data.collection_id, data);
//   self.ready();
// });


Meteor.publish('collection-list', function() {
  const db  = require("/imports/api/mysql");
  console.time('collection-list');
  let self = this;
  if(!self.userId) return [];
  let getUser = Meteor.users.findOne({ _id: self.userId });
  let getProfile = getUser.profile;

  let pgmView = getProfile.level > 1 && getProfile.level < 5;
  let otherPrivate = getProfile.level < 1;
  let forProject = getProfile.level >= 5;

  let query_collection = `
  SELECT p.name collection_name, LOWER(p.name) order_name, COUNT(p.collection_id) list, p.collection_id, NULL user_id
  FROM repository r
  LEFT JOIN repository_collection p ON r.collection_id = p.collection_id
  ${!pgmView?``:`
  LEFT JOIN repository_contributor c 
    ON c.repository_id = r.repository_id and c.permission in ('Contributors','Administrators')
  `}
  WHERE r.collection_id IS NOT NULL AND content_id IS NULL AND fork_id IS NULL
    ${otherPrivate?``:`
    AND (r.private = 'NO' OR (r.private = 'YES' AND r.user_id = ${getProfile.user_id}))
    `}
    ${!pgmView?`
    `:`
    AND (c.user_id IS NULL OR (c.user_id IS NOT NULL AND c.user_id = ${getProfile.user_id}))
    AND (c.user_id = ${getProfile.user_id} OR r.anonymous = 'YES')
    `}
  GROUP BY p.name, p.collection_id;
  `;

  let query_user = `
  SELECT u.username collection_name, LOWER(u.username) order_name, count(r.user_id) list, NULL collection_id, r.user_id 
  FROM repository r
  ${!pgmView?``:`
  LEFT JOIN repository_contributor c 
    ON c.repository_id = r.repository_id and c.permission in ('Contributors','Administrators')
    `}
  LEFT JOIN user u ON u.user_id = r.user_id
  WHERE r.collection_id IS NULL 
    AND content_id IS NULL AND fork_id IS NULL
    ${otherPrivate?``:`
    AND (r.private = 'NO' OR (r.private = 'YES' AND r.user_id = ${getProfile.user_id}))
    `}
    ${!pgmView?``:`
    AND (c.user_id IS NULL OR (c.user_id IS NOT NULL AND c.user_id = ${getProfile.user_id}))
    AND (c.user_id = ${getProfile.user_id} OR r.anonymous = 'YES')
    `}
  GROUP BY u.username, r.user_id 
  `; // ${ !programmer?``:`OR p.collection_id IS NOT NULLs `  }

  db.query(query_collection).forEach(function(item){
    if(item.list > 0) {
      self.added('list.collection-name', 'c'+item.collection_id, item);
    }
	});

  let ownerCreated = false;
  db.query(query_user).forEach(function(item){
    if(item.collection_name === getUser.username && getProfile.level < 4) {
      ownerCreated = true;
      self.added('list.collection-user', item.user_id, item);
    } else if(item.list > 0) {
      self.added('list.collection-name', 'u'+item.user_id, item);
    }
  });

  if(!ownerCreated && getProfile.level < 4) {
    self.added('list.collection-user', getProfile.user_id, { 
      collection_name: getUser.username, 
      list: 0, 
      collection_id: null, 
      user_id: getProfile.user_id 
    });
  }
	self.ready();
  console.timeEnd('collection-list');
});

Meteor.publish('repository-list', function(collection) {
  const db  = require("/imports/api/mysql");
  console.time('repository-list');
  let self = this;
  if(!self.userId) return [];

  let getUser = Meteor.users.findOne({ _id: self.userId });
  let collection_name = collection || getUser.username;
  let getProfile = getUser.profile;

  let pgmView = getProfile.level > 1 && getProfile.level < 5;
  let otherPrivate = getProfile.level < 1;
  let forProject = getProfile.level >= 5;

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
  ${ !pgmView?``:`
  LEFT JOIN repository_contributor c 
    ON c.repository_id = r.repository_id AND c.permission in ('Contributors','Administrators')
  `}
  WHERE content_id IS NULL AND fork_id IS NULL
    ${otherPrivate?``:`
    AND (r.private = 'NO' OR (r.private = 'YES' AND r.user_id = ${getProfile.user_id}))
    `}
    ${ !pgmView?`
    `:`
    AND (c.user_id IS NULL OR (c.user_id IS NOT NULL AND c.user_id = ${getProfile.user_id}))
    AND (c.user_id = ${getProfile.user_id} OR r.anonymous = 'YES')
    `}
  AND (co.name = '${collection_name}' OR (u.username = '${collection_name}' AND r.collection_id IS NULL))
  `;

  let dbRepository = db.query(query);
  console.log(collection_name, '--', dbRepository.length);
  dbRepository.forEach(function(item){

    var findCommits = (Meteor.wrapAsync(function(callback) {
    	let obj = mongo.Commit.findOne({ repository_id: item.repository_id }).sort({since : -1});
	    obj.exec(function(err, result){ callback(err, result); });
    }))();

    item.updated_at = (findCommits || {}).since || item.updated_at;        
    self.added('list.repository', item.repository_id, item);
  });
	self.ready();
  console.timeEnd('repository-list');
});

Meteor.publish('repository-loaded', function(param){
  const db  = require("/imports/api/mysql");
  console.time('repository-loaded');
  let summary = {
    collection: param.collection,
    repository: param.repository
  };
  let thread = [];
  let self = this;
  if(!self.userId) return [];

  let UserProfile = Meteor.users.findOne({ _id: self.userId }).profile;
  // let api = `http://${config.socket}:${config.api}/api/repository/files/${summary.collection}/${summary.repository}/master`;

  // var response = HTTP.get(api);
  // try { response = JSON.parse(response.content); } catch (e) { response = {} }

  // console.log(response);

  let repositories = db.one(`SELECT repository_id FROM repositories WHERE dir_name = '${param.collection}/${param.repository}'`);

  summary.commits = (Meteor.wrapAsync(function(callback) {
  	let obj = mongo.Commit.find({ repository_id: repositories.repository_id, logs: true }).count();
    obj.exec(function(err, result){ callback(err, result); });
  }))();


	let query_loaded = `
	  SELECT COUNT(*) person 
	  FROM repository_contributor 
	  WHERE repository_id = ${repositories.repository_id}
	`;
	let person = db.query(query_loaded);
	if(person.length == 0) {
    summary.contributor = 0;
  } else {
    summary.contributor = person[0].person;
  }

	let repo = (Meteor.wrapAsync(function(callback) {
		mongo.Repository.findOne(repositories, function(err, result){ callback(err, result); });
  }))() || {};
  summary.title = repo.title;
  summary.description = repo.description;
  summary.master = repo.master;
  summary.branch = repo.branch;
  summary.readme = (repo.readme || '').toString();
  self.added('summary.repository', repositories.repository_id, summary);

  (repo.files || []).forEach(function(file){
    self.added('file.repository', file.filename, {
      collection: param.collection,
      repository: param.repository,
      filename: file.filename,
      ext: file.ext,
      size: file.size,
      since: file.since,
      comment: file.comment
    });
  });
	let logs = (Meteor.wrapAsync(function(callback) {
    let commits = mongo.Commit.find(repositories).sort({since : -1}).limit(13);
    commits.exec(function(err, result){ callback(err, result); });
  }))();
	(logs || []).forEach(function(log){
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
  console.timeEnd('repository-loaded');
});



// db.end(function(err) {
// 	console.log('The connection', err);
//   // The connection, table events and queries are terminated now
// });