const { makeWrapResolversPlugin } = require('graphile-utils')
	, { GraphQLError } = require('graphql');

module.exports = makeWrapResolversPlugin(
	context => context.scope.isRootMutation || null,
	() => async (resolve, source, args, context) => {
		const hasWarning = { warning: null };
		const onNotice = n => n.severity === 'WARNING' && (hasWarning.warning = n);

		try {
			context.pgClient.on('notice', onNotice);

			const res = await resolve();

			if (hasWarning.warning)
				throw new GraphQLError(hasWarning.warning.message);

			return res;
		} catch (e) {
			throw e;
		} finally {
			context.pgClient.off('notice', onNotice);
		}
	}
);
