/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    reactStrictMode: true,
    optimizeFonts: true,
    compress: true,
    poweredByHeader: false,
    experimental: {
      optimizeCss: true,
      webpackBuildWorker: true
    },
    webpack: (config, { isServer }) => {
      if (!isServer) {
        config.optimization = {
          ...config.optimization,
          splitChunks: {
            chunks: 'all',
            minSize: 20000,
            maxSize: 244000
          }
        }
      }
      return config
    }
  };
  
  module.exports = nextConfig;