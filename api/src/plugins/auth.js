const { makeExtendSchemaPlugin, gql } = require('graphile-utils');

module.exports = makeExtendSchemaPlugin(() => ({
	typeDefs: gql`
		extend type Mutation {
			register (
				email: String!
				password: String!
				name: String!
			): Boolean
			
			authenticate (
				email: String!
				password: String!
			): Boolean
			
			logout: Boolean
		}
	`,
	resolvers: {
		Mutation: {
			async register (_query, args, { pgClient, setSession }) {
				try {
					await pgClient.query('set role server');
					const { rows: [success] } = await pgClient.query(
						'select private.register($1, $2, $3);',
						[args.email, args.password, args.name]
					);
					await pgClient.query('reset role');

					if (!success?.register)
						return false;

					await setSession('user_id', success.register);

					return true;
				} catch (e) {
					console.log(e);
					return false;
				}
			},

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

			async logout (_, __, { setSession }) {
				await setSession('user_id', '');

				return true;
			},
		},
	},
}));
