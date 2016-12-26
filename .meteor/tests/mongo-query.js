const config 		= require('$custom/config');
const mongo     = require('$custom/schema');

let commits = mongo.Commit.aggregate( [
	{ $match : { email : { '$in': [ 'kem@ns.co.th', 'info.dvgamer@gmail.com'] }, logs: true } },
	{ $group : { _id : { commit_id : "$commit_id", email: "$email" }, books: { $push: "$repository_id" }, count: { $sum: 1 } } }
]);

commits.exec(function(err, logs){
	logs.forEach(function(item){
		if(item.books.join('-').indexOf('2') == -1 && item.books.join('-').indexOf('81') == -1) {
			console.log(item.books.join('-'));
		}
	});
	console.log(err, logs.length);
});