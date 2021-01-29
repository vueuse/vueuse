// @ts-check
const indexes = require('../../indexes.json')

const categoriesOrder = [
  'Browser',
  'Sensors',
  'Animation',
  'State',
  'Component',
  'Watch',
  'Utilities',
  'Misc',
]

/**
 * @type {import('vitepress').UserConfig}
 */
const config = {
  title: 'VueUse',
  description: 'Collection of essential Vue Composition Utilities',
  themeConfig: {
    logo: '/favicon.svg',
    repo: 'vueuse/vueuse',
    docsDir: 'packages',
    editLinks: true,
    editLinkText: 'Edit this page',
    lastUpdated: 'Last Updated',
    nav: [
      // { text: 'Home', link: '/' },s
      { text: 'Guide', link: '/guide' },
      { text: 'Functions', link: '/functions' },
      { text: 'Add-ons', link: '/add-ons' },
      { text: 'Ecosystem', link: '/ecosystem' },
      { text: 'Contribute', link: '/contributing' },
    ],
    sidebar: getSideBar(),
    algolia: {
      apiKey: 'a99ef8de1b2b27949975ce96642149c6',
      indexName: 'vueuse',
    },
  },
  head: [
    ['link', { rel: 'icon', href: '/favicon-32x32.png', type: 'image/png' }],
    ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
    ['meta', { name: 'author', content: 'Anthony Fu' }],
    ['meta', { property: 'og:title', content: 'VueUse' }],
    ['meta', { property: 'og:image', content: 'https://vueuse.js.org/og.png' }],
    ['meta', { property: 'og:description', content: 'Collection of essential Vue Composition Utilities' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:creator', content: '@antfu7' }],
    ['meta', { name: 'twitter:image', content: 'https://vueuse.js.org/og.png' }],
  ],
}

function getSideBar() {
  const links = []
  const { categories } = indexes

  categories
    .sort((a, b) => categoriesOrder.indexOf(a) - categoriesOrder.indexOf(b))
    .sort((a, b) => a.startsWith('@') ? 1 : b.startsWith('@') ? -1 : 0)

  for (const name of categories) {
    if (name.startsWith('_'))
      continue

    const functions = indexes.functions.filter(i => i.category === name && !i.internal)

    links.push({
      text: name,
      children: functions.map(i => ({
        text: i.name,
        link: `/${i.package}/${i.name}/`,
      })),
      link: name.startsWith('@') ? `/${functions[0].package}/README` : undefined,
    })
  }

  return links
}

module.exports = config
