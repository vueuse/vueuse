/* eslint-disable @typescript-eslint/no-var-requires */
const prism = require('markdown-it-prism')
const highlightLines = require('markdown-it-highlight-lines')
const linkAttributes = require('markdown-it-link-attributes')
const replaceLink = require('markdown-it-replace-link')

require('prismjs/components/prism-typescript')
require('prismjs/components/prism-javascript')
require('prismjs/components/prism-json')
require('prismjs/components/prism-jsx')
require('prismjs/components/prism-tsx')
require('prismjs/components/prism-bash')

module.exports = ({ config }) => {
  config.module.rules.push({
    test: /\.md$/,
    use: [
      {
        loader: require.resolve('markdown-it-loader'),
        options: {
          html: true,
          xhtmlOut: true,
          linkify: true,
          typographer: true,
          replaceLink: (link) => {
            return link.replace(/resources\/logo-vertical.png/, 'resources/logo-vertical-dark.png')
          },
          use: [
            prism,
            highlightLines,
            [
              linkAttributes,
              {
                pattern: /^https?:/,
                attrs: {
                  class: 'external-link',
                  target: '_blank',
                },
              },
            ],
            replaceLink,
          ],
        },
      },
      {
        loader: require.resolve('../scripts/types-loader'),
      },
    ],
  })

  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    use: [
      {
        loader: require.resolve('babel-loader'),
        options: {
          plugins: [
            [
              'const-enum',
              {
                transform: 'constObject',
              },
            ],
          ],
          presets: ['@babel/env', '@babel/typescript', '@vue/jsx'],
        },
      },
    ],
  })

  config.module.rules.push({
    test: /\.css$/,
    use: [
      {
        loader: 'postcss-loader',
        options: {
          ident: 'postcss',
          plugins: [
            require('postcss-import'),
            require('tailwindcss'),
            require('autoprefixer'),
          ],
        },
      },
    ],
  })

  config.resolve.extensions.push('.ts', '.tsx')
  config.resolve.symlinks = false
  return config
}
