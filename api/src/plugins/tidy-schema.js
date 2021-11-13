module.exports = function RemoveEverythingFromQueryExceptAll(builder) {
	builder.hook('GraphQLObjectType:fields', (fields, _, { Self }) => {
		if (Self.name !== 'Query') return fields;

		for (const key in fields)
			if (fields.hasOwnProperty(key) && key.indexOf('By') > -1)
				delete fields[key];

		return fields;
	});
};
