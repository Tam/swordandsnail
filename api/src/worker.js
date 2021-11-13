const { run } = require("graphile-worker");

async function main() {
	// Run a worker to execute jobs:
	const runner = await run({
		connectionString: process.env.ROOT_DATABASE_URL,
		concurrency: 5,
		noHandleSignals: false,
		pollInterval: 1000,
		taskDirectory: `${__dirname}/tasks`,
		crontabFile: `${__dirname}/crontab`,
	});

	// If the worker exits (whether through fatal error or otherwise), this
	// promise will resolve/reject:
	await runner.promise;
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
