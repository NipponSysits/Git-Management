module.exports = {
	dev: {
		ip: '0.0.0.0',
		port: 8210,
		mongo_db: {
			domain: 'pgm.ns.co.th',
			dbname: 'ns_develop',
			access: {
				username: 'pgm',
				password: '123456'
			},
			port: 20317
		},
		mysql_db: {
			host: 'pgm.ns.co.th',
			database: 'ns_develop',
			user: 'root',
			password: '123456',
			port: 33061
		}
	},
	serv: {
		ip: '0.0.0.0',
		port: 8210,
		mongo_db: {
			domain: '10.0.1.21',
			dbname: 'ns_develop',
			access: {
				username: 'pgm',
				password: '123456'
			},
			port: 20317
		},
		mysql_db: {
			host: '10.0.1.21',
			database: 'ns_develop',
			user: 'root',
			password: '123456',
			port: 33061
		}
	}
}