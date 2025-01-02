/** @type {import('next').NextConfig} */
const nextConfig = { 
    output: 'standalone',
    reactStrictMode: true,
		optimizeFonts: true,
		compress: true,
		experimental: {
			optimizeCss: true
		},
};
module.exports = nextConfig;