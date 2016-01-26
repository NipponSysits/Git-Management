module.exports = {
	dev: {
		ip: '127.0.0.1',
		port: 8210,
		mongo_db: {
			domain: 'dev.ns.co.th',
			dbname: 'ns_develop',
			access: {
				username: 'pgm',
				password: '123456'
			},
			port: 20317
		},
		mysql_db: {
			host: 'dev.ns.co.th',
			database: 'ns_develop',
			user: 'pgm',
			password: 'pgm1234',
			port: 20400
		}
	},
	serv: {
		ip: '10.0.1.21',
		port: 8210,
		mongo_db: {
			domain: 'dev.ns.co.th',
			dbname: 'ns_develop',
			access: {
				username: 'pgm',
				password: '123456'
			},
			port: 20317
		},
		mysql_db: {
			host: 'dev.ns.co.th',
			database: 'ns_develop',
			user: 'pgm',
			password: 'pgm1234',
			port: 20400
		}
	}
}