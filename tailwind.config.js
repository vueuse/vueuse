module.exports = {
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: [
      './.storybook/*.html',
      './.storybook/*.css',
      './packages/**/*.stories.tsx',
    ],
  },
}
