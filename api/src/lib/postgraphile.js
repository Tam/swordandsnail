const { makePluginHook } = require('postgraphile');

const isDev = process.env.NODE_ENV === 'dev';

const setCors = () => ({
	['postgraphile:http:handler'](req, {res}) {
		const origin = req.get('origin');

		if (
			!isDev && [
				process.env.APP_URL,
				'https://' + process.env.VIRTUAL_HOST,
			].indexOf(origin) === -1
		) return req;

		res.setHeader('Access-Control-Allow-Origin', origin ?? '*');
		res.setHeader('Access-Control-Allow-Methods', 'HEAD, GET, POST');
		res.setHeader('Access-Control-Allow-Credentials', 'true');
		res.setHeader(
			'Access-Control-Allow-Headers',
			[
				'Origin',
				'X-Requested-With',
				'Accept',
				'Content-Type',
				'Content-Length',
				'X-PostGraphile-Explain',
			].join(', '),
		);
		res.setHeader(
			'Access-Control-Expose-Headers',
			[
				'X-GraphQL-Event-Stream',
			].join(', '),
		);

		return req;
	}
});

const pluginHook = makePluginHook([setCors()]);
const publicSchemas = ['public'];

const postgraphileOptions = dbPool => ({
	pluginHook,
	retryOnInitFail: true,
	dynamicJson: true,
	setofFunctionsContainNulls: false,
	ignoreRBAC: false,
	ignoreIndexes: true,
	watchPg: isDev,
	appendPlugins: [
		require('@graphile-contrib/pg-simplify-inflector'),
		require('postgraphile-plugin-connection-filter'),
		require('../plugins/auth'),
		require('../plugins/primary-key-mutations-only'),
		require('../plugins/throw-warnings'),
		require('../plugins/tidy-schema'),
	].filter(Boolean),
	graphiql: isDev,
	enhanceGraphiql: isDev,
	allowExplain: req => isDev,
	enableQueryBatching: true,
	disableQueryLog: !isDev,
	legacyRelations: 'omit',
	simpleCollections: 'both',
	exportGqlSchemaPath: isDev ? '/home/node/app/schema.graphql' : null,
	sortExport: true,
	ownerConnectionString: process.env.ROOT_DATABASE_URL,
	graphileBuildOptions: {
		connectionFilterAllowEmptyObjectInput: true,
		connectionFilterAllowNullInput: true,
		connectionFilterComputedColumns: true,
		connectionFilterRelations: true,
		connectionFilterSetofFunctions: true,
		pgStrictFunctions: true,
	},
	handleErrors: errors => errors.map(err => {
		isDev && console.error('[Error Handler]', err);
		const { originalError } = err;
		const { table, constraint } = originalError || {};
		if (table && constraint) {
			return {
				...err,
				message: `constraint_${constraint}`,
				raw: { table, constraint },
			};
		}

		return err;
	}),

	additionalGraphQLContextFromRequest: req => ({
		setSession: (key, value) => req.session[key] = value,
		getSession: key => req.session[key],
		delSession: () => req.session.destroy(),
	}),

	async pgSettings (req) {
		const user_id = req?.session?.user_id ?? null;

		if (user_id) {
			const { rows: [account] } = await dbPool.query(
				'select role from public.account where user_id = $1',
				[user_id]
			);

			const isAdmin = account.role === 'admin'
				, role = account.role;

			return {
				role,
				'session.user_id': user_id,
				'session.admin': isAdmin.toString(),
				'session.id': req?.sessionID,
			};
		}

		return {
			role: 'anonymous',
			'session.user_id': 'null',
			'session.admin': 'false',
		};
	},
});

module.exports = {
	publicSchemas,
	postgraphileOptions,
};
