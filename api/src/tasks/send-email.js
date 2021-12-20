const postmark = require('../lib/postmark')
	, alias = require('../util/alias');

module.exports = async payload => {
	const { to, template, meta } = payload;

	// Parse any ENV variables
	for (let key in meta)
		if (meta.hasOwnProperty(key) && typeof meta[key] === 'string')
			meta[key] = alias(meta[key]);

	postmark.sendEmailWithTemplate({
		'From': process.env.SYSTEM_EMAIL,
		'To': to,
		'TemplateAlias': template,
		'TemplateModel': meta,
		'MessageStream': process.env.NODE_ENV === 'production' ? 'outbound' : 'staging',
	});
};
