import path from 'path'

/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		domains: ['localhost'],
	},
	async rewrites() {
		return [
			// Rewrite socket.io first
			{
				source: '/socket.io/:path*',
				destination: 'http://localhost:3001/socket.io/:path*',
			},
			// Don't rewrite auth routes - must come before the generic /api/:path* rule
			{
				source: '/api/auth/:path*',
				destination: '/api/auth/:path*',
			},
			// Rewrite other API routes to the external API
			{
				source: '/api/:path*',
				destination: 'http://localhost:3001/api/:path*',
				// Add a has condition to exclude auth routes that might have slipped through
				has: [
					{
						type: 'header',
						key: 'x-middleware-rewrite',
						value: '^(?!.*/api/auth/).*$'
					}
				]
			},
		];
	},
	webpack: (config) => {
		config.externals = [...(config.externals || []), 'canvas', 'jsdom'];
		config.resolve = config.resolve || {};
		config.resolve.alias = {
			...(config.resolve.alias || {}),
			'@': path.resolve(process.cwd(), 'src'),
		};
		return config;
	},
};

export default nextConfig;
