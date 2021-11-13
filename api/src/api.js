const express = require('express')
	, session = require('express-session')
	, { Pool } = require('pg')
	, { postgraphile } = require('postgraphile')
	, { publicSchemas, postgraphileOptions } = require('./lib/postgraphile');

const dbPool = new Pool({
	max: process.env.DB_POOL_MAX,
	allowExitOnIdle: true,
});

const app = express();

// Force a timeout of any query after 3 seconds
dbPool.on('connect', client => client.query('SET statement_timeout TO 3000'));

app.use(session({
	store: new (require('connect-pg-simple')(session))({
		pool: dbPool,
		schemaName: 'private',
		tableName: 'session',
	}),
	secret: process.env.SESSION_COOKIE_SECRET,
	resave: false,
	cookie: {
		maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
		secure: true,
		httpOnly: true,
		sameSite: 'strict',
	},
}));
app.use(postgraphile(dbPool, publicSchemas, postgraphileOptions(dbPool)));

app.listen(
	5000,
	() => console.log('Listening on port 5000')
);
