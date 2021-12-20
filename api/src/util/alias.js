/**
 * Replaces $ENV_VAR with it's current value
 * or an empty string if it doesn't exist
 *
 * @param {string} str
 * @return {string}
 */
module.exports = function alias (str) {
	return str.replace(/\$([A-Z0-9_]+)/g, (_, key) => {
		return process.env[key] || '';
	});
};
