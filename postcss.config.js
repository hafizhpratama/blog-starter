module.exports = {
  plugins: {
    'cssnano': {
      preset: ['default', {
        discardComments: { removeAll: true },
        normalizeWhitespace: true
      }]
    },
    tailwindcss: {},
    autoprefixer: {},
  }
}