const { makeExtendSchemaPlugin, gql } = require('graphile-utils');

module.exports = makeExtendSchemaPlugin(() => ({
	typeDefs: gql`
		extend type Mutation {
			authenticate (
				email: String!
				password: String!
			): Boolean
			
			logout: Boolean
		}
	`,
	resolvers: {
		Mutation: {
			async authenticate (_query, args, { pgClient, setSession }) {
				try {
					await pgClient.query('set role server');
					const { rows: [success] } = await pgClient.query(
						'select private.authenticate($1, $2);',
						[args.email, args.password]
					);
					await pgClient.query('reset role');

					if (!success?.authenticate)
						return false;

					await setSession('user_id', success.authenticate);

					return true;
				} catch (e) {
					console.log(e);
					return false;
				}
			},

			async logout (_, __, { delSession }) {
				delSession();

				return true;
			},
		},
	},
}));
