/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    poweredByHeader: false,
    compress: true,
    reactStrictMode: true,
    swcMinify: true,
    compiler: {
      removeConsole: process.env.NODE_ENV === 'production',
    },
    experimental: {
      optimizeCss: true,
      turbo: {
        rules: {
          // Prevent specific files from being included in the client bundle
          '*.server.ts': ['server-only'],
        },
      },
    },
    webpack: (config, { dev, isServer }) => {
      // Optimize CSS extraction
      if (!dev && !isServer) {
        config.optimization.splitChunks.cacheGroups.styles = {
          name: 'styles',
          test: /\.(css|scss)$/,
          chunks: 'all',
          enforce: true,
        };
      }
  
      return config;
    },
  };
  
  module.exports = nextConfig;