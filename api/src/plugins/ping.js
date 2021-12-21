const { makeExtendSchemaPlugin, gql } = require('graphile-utils');

module.exports = makeExtendSchemaPlugin(() => ({
	typeDefs: gql`
		extend type Query {
			ping: String!
		}
	`,
	resolvers: {
		Query: {
			ping () { return 'pong'; },
		},
	},
}));
