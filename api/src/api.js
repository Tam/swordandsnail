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

app.set('trust proxy', 1);
app.use(session({
	store: new (require('connect-pg-simple')(session))({
		pool: dbPool,
		schemaName: 'private',
		tableName: 'session',
	}),
	secret: process.env.SESSION_COOKIE_SECRET,
	resave: false,
	rolling: true,
	saveUninitialized: false,
	name: 'snails.satchel',
	cookie: {
		maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
		secure: true,
		httpOnly: true,
		sameSite: 'strict',
		domain: 'swordandsnail.com',
	},
}));
app.use(postgraphile(dbPool, publicSchemas, postgraphileOptions(dbPool)));
app.get('/session', (req, res, next) => {
	if (req.session.views) req.session.views++;
	else req.session.views = 1;
	res.end(JSON.stringify({
		views: req.session.views,
		cookies: req.headers.cookie,
	}));
});

app.listen(
	5000,
	() => console.log('Listening on port 5000')
);
