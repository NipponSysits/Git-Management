import { Meteor } 	from 'meteor/meteor';

const config 		= require('$custom/config');
const db 				= Mysql.connect(config.mysql);

Meteor.publish('collection-list', function() {
  // Meteor._sleepForMs(2000);
  let self = this;
  if(!self.userId) return [];
  let UserProfile = Meteor.users.findOne({ _id: self.userId }).profile;
  let level = UserProfile.role.level > 1;

  let query_collection = `
  SELECT p.name collection_name, COUNT(p.collection_id) list, p.collection_id, NULL user_id
  FROM repository r
  LEFT JOIN repository_collection p ON r.collection_id = p.collection_id
  ${ !level?``:`
  LEFT JOIN repository_contributor c 
    ON c.repository_id = r.repository_id and c.permission in ('Contributors','Administrators')
  `}
  WHERE r.collection_id IS NOT NULL AND content_id IS NULL AND fork_id IS NULL
  ${ !level?``:`
  AND (c.user_id IS NULL OR (c.user_id IS NOT NULL AND c.user_id = ${UserProfile.user_id}))
  AND (r.user_id = ${UserProfile.user_id} OR r.anonymous = 'YES')
  AND (r.private = 'NO' OR (r.private = 'YES' AND r.user_id = ${UserProfile.user_id}))
  `}
  GROUP BY p.name, p.collection_id;
  `;

  let query_user = `
  SELECT u.username collection_name, count(r.user_id) list, NULL collection_id, r.user_id 
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
  AND (r.user_id = ${UserProfile.user_id} OR r.anonymous = 'YES')
  AND (r.private = 'NO' OR (r.private = 'YES' AND r.user_id = ${UserProfile.user_id}))
  `}
  GROUP BY u.username, r.user_id 
  `; // ${ !level?``:`OR p.collection_id IS NOT NULL `  }

  db.query(query_collection, function(err, data){
  	if(err) self.error(err);
		(data || []).forEach(function(item){
      if(item.list > 0) {
        self.added('list.collection-name', item.collection_id, item);
      }
		});

    db.query(query_user, function(err, data){
      if(err) self.error(err);
      (data || []).forEach(function(item){
        if(item.list > 0) {
          self.added('list.collection-user', item.user_id, item);
        }
      });
  		self.ready();
    });
  });
});

Meteor.publish('repository-list', function(collection_id, user_id) {
  // Meteor._sleepForMs(1000);

  let self = this;
  if(!self.userId) return [];

  let UserProfile = Meteor.users.findOne({ _id: self.userId }).profile;
  if(!collection_id && !user_id) {
    user_id = UserProfile.user_id
  }
  let level = UserProfile.role.level > 1;

  let query = `
  SELECT 
    r.repository_id, r.collection_id, r.user_id, r.project_id, 
    r.name, r.fullname, r.description, r.private, r.anonymous, r.logo 
  FROM repository r
  ${ !level?``:`
  LEFT JOIN repository_contributor c 
    ON c.repository_id = r.repository_id AND c.permission in ('Contributors','Administrators')
  `}
  WHERE content_id IS NULL AND fork_id IS NULL
  ${ !level?``:`
  AND ${collection_id?`r.collection_id=${collection_id}`:`r.collection_id IS NULL AND r.user_id=${user_id}`}
  AND (c.user_id IS NULL OR (c.user_id IS NOT NULL AND c.user_id = ${UserProfile.user_id}))
  AND (r.user_id = ${UserProfile.user_id} OR r.anonymous = 'YES')
  AND (r.private = 'NO' OR (r.private = 'YES' AND r.user_id = ${UserProfile.user_id}))
  `}
  `;

  db.query(query, function(err, data){
  	if(err) self.error(err);

		(data || []).forEach(function(item){
  		self.added('list.repository', item.repository_id, item);
		});
		self.ready();
  });
});

// const liveDbs 		= new LiveMysql(config.mysql);

Meteor.publish('getDashboardProfile', function(username){
  // return liveDb.select(`SELECT * FROM user_access WHERE username='`+username+`'`, [{ 
  // 	table: 'user' 
  // }]);
  this.ready();
});


// db.end(function(err) {
// 	console.log('The connection', err);
//   // The connection, table events and queries are terminated now
// });