const isDev = process.env.NODE_ENV === 'dev';
const ignore_watch = ['schema.graphql'];

module.exports = [{
	script: 'api.js',
	name: 'api',
	watch: isDev,
	ignore_watch,
	node_args: isDev ? '--inspect=0.0.0.0' : void 0,
	env: {
		DEBUG: 'graphile-build:warn',
	},
}, {
	script: 'worker.js',
	name: 'worker',
	watch: isDev,
	ignore_watch,
	node_args: isDev ? '--inspect=0.0.0.0:9228' : void 0,
}];
