module.exports = {
	reactStrictMode: true,
	swcMinify: true,
	
	env: {
		ssridCookieName: 'snail.ssrid',
	},

	async headers () {
		return [
			{
				source: '/(.*?)',
				headers: [
					{
						key: 'Permission-Policy',
						value: 'interest-cohort=()',
					},
					{
						key: 'X-Content-Type-Options',
						value: 'nosniff',
					},
					{
						key: 'X-Frame-Options',
						value: 'DENY',
					},
					{
						key: 'X-XSS-Protection',
						value: '1',
					},
				],
			},
		];
	},
};
