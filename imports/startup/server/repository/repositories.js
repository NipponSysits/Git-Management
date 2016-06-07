import { Meteor } 	from 'meteor/meteor';

const config 		= require('$custom/config');
const mongo     = require('$custom/schema');
const db        = Mysql.connect(config.mysql);


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
  let level = UserProfile.role.level > 1;

  let query_collection = `
  SELECT p.name collection_name, LOWER(p.name) order_name, COUNT(p.collection_id) list, p.collection_id, NULL user_id
  FROM repository r
  LEFT JOIN repository_collection p ON r.collection_id = p.collection_id
  ${ !level?``:`
  LEFT JOIN repository_contributor c 
    ON c.repository_id = r.repository_id and c.permission in ('Contributors','Administrators')
  `}
  WHERE r.collection_id IS NOT NULL AND content_id IS NULL AND fork_id IS NULL
    ${ !level?``:`
    AND (c.user_id IS NULL OR (c.user_id IS NOT NULL AND c.user_id = ${UserProfile.user_id}))
    AND (c.user_id = ${UserProfile.user_id} OR r.anonymous = 'YES')
    AND (r.private = 'NO' OR (r.private = 'YES' AND r.user_id = ${UserProfile.user_id}))
    `}
  GROUP BY p.name, p.collection_id;
  `;

  let query_user = `
  SELECT u.username collection_name, LOWER(u.username) order_name, count(r.user_id) list, NULL collection_id, r.user_id 
  FROM repository r
  ${ !level?``:`
  LEFT JOIN repository_contributor c 
    ON c.repository_id = r.repository_id and c.permission in ('Contributors','Administrators')
    `}
  LEFT JOIN user u ON u.user_id = r.user_id
  WHERE r.collection_id IS NULL 
    AND content_id IS NULL AND fork_id IS NULL
    ${ !level?``:`
    AND (c.user_id IS NULL OR (c.user_id IS NOT NULL AND c.user_id = ${UserProfile.user_id}))
    AND (c.user_id = ${UserProfile.user_id} OR r.anonymous = 'YES')
    AND (r.private = 'NO' OR (r.private = 'YES' AND r.user_id = ${UserProfile.user_id}))
    `}
  GROUP BY u.username, r.user_id 
  `; // ${ !level?``:`OR p.collection_id IS NOT NULLs `  }


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
      if(!ownerCreated) {
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

Meteor.publish('repository-list', function() {
  // Meteor._sleepForMs(1000);

  let self = this;
  if(!self.userId) return [];

  let UserProfile = Meteor.users.findOne({ _id: self.userId }).profile;
  // if(!collection_id && !user_id) {
  //   user_id = UserProfile.user_id
  // }
  let level = UserProfile.role.level > 1;

  let query = `
  SELECT 
    r.repository_id, r.collection_id, r.user_id, r.project_id, p.name project_name, LOWER(p.name) order_project,
    co.name collection_name, u.username, 
    (CASE WHEN r.fullname IS NULL THEN r.name ELSE r.fullname END) repository_name, 
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
  ${ !level?`

  `:`
  LEFT JOIN repository_contributor c 
    ON c.repository_id = r.repository_id AND c.permission in ('Contributors','Administrators')
  `}
  WHERE content_id IS NULL AND fork_id IS NULL
  ${ !level?``:`
  AND (c.user_id IS NULL OR (c.user_id IS NOT NULL AND c.user_id = ${UserProfile.user_id}))
  AND (c.user_id = ${UserProfile.user_id} OR r.anonymous = 'YES')
  AND (r.private = 'NO' OR (r.private = 'YES' AND r.user_id = ${UserProfile.user_id}))
  `}
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

Meteor.publish('getDashboardProfile', function(username){
  // return liveDb.select(`SELECT * FROM users WHERE username='`+username+`'`, [{ 
  // 	table: 'user' 
  // }]);
  this.ready();
});


// db.end(function(err) {
// 	console.log('The connection', err);
//   // The connection, table events and queries are terminated now
// });