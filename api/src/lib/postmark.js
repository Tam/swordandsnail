const postmarkLib = require('postmark');
const postmark = new postmarkLib.ServerClient(process.env.POSTMARK_API);

module.exports = postmark;
