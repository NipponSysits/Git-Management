module.exports = {
	dev: {
		ip: '127.0.0.1',
		port: 8220,
		mongo_db: {
			domain: 'touno-k.noip.me',
			dbname: 'store_anime',
			access: {
				username: 'root',
				password: '123456'
			},
			port: 27017
		},
		mysql_db: {
			username: 'root',
			password: '123456',
			port: 3301
		}
	},
	serv: {
		ip: '122.155.3.228',
		port: 8220,
		mongo_db: {
			domain: 'touno-k.noip.me',
			dbname: 'store_anime',
			access: {
				username: 'root',
				password: '123456'
			},
			port: 27017
		},
		mysql_db: {
			username: 'root',
			password: '123456',
			port: 3301
		}
	}
}