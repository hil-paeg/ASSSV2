import path from 'path'

/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		domains: ['localhost'],
	},
	async rewrites() {
		return [
			{
				source: '/api/:path*',
				destination: 'http://localhost:3001/api/:path*',
			},
			{
				source: '/socket.io/:path*',
				destination: 'http://localhost:3001/socket.io/:path*',
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
