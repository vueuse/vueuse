// @ts-expect-error
import base from '@vue/theme/config'
import indexes from '../../indexes.json'
import { currentVersion, versions } from '../../meta/versions'
import highlight from './highlight'

const themeConfig = async() => {
  const config = await base()
  config.markdown.highlight = await highlight()
  return config
}

const categoriesOrder = [
  'Browser',
  'Sensors',
  'Animation',
  'State',
  'Component',
  'Watch',
  'Formatters',
  'Utilities',
  'Misc',
]

const Guide = [
  { text: 'Get Started', link: '/guide/index' },
  { text: 'Best Practice', link: '/guide/best-practice' },
  { text: 'Configurations', link: '/guide/config' },
  { text: 'Components', link: '/guide/components' },
  { text: 'Contributing', link: '/contributing' },
  { text: 'Guidelines', link: '/guidelines' },
]

const Functions = [
  { text: 'Animation', link: '/functions#animation' },
  { text: 'Browser', link: '/functions#browser' },
  { text: 'Component', link: '/functions#component' },
  { text: 'Formatters', link: '/functions#formatters' },
  { text: 'Misc', link: '/functions#misc' },
  { text: 'Sensors', link: '/functions#sensors' },
  { text: 'State', link: '/functions#state' },
  { text: 'Utilities', link: '/functions#utilities' },
  { text: 'Watch', link: '/functions#watch' },
]

const Links = [
  { text: 'Add-ons', link: '/add-ons' },
  { text: 'Ecosystem', link: '/ecosystem' },
  { text: 'Export Size', link: '/export-size' },
  { text: 'Recent Updated', link: '/recent-updated' },
]

const DefaultSideBar = [
  { text: 'Guide', items: Guide },
  { text: 'Core Functions', items: Functions },
  { text: 'Links', items: Links },
]

const FunctionsSideBar = getFunctionsSideBar()

/**
 * @type {import('vitepress').UserConfig}
 */
const config = {
  extends: themeConfig,

  title: 'VueUse',
  description: 'Collection of essential Vue Composition Utilities',
  lang: 'en-US',

  themeConfig: {
    logo: '/favicon.svg',
    repo: 'vueuse/vueuse',
    docsDir: 'packages',

    editLinks: true,
    editLinkText: 'Edit this page',
    lastUpdated: 'Last Updated',

    algolia: {
      apiKey: 'a99ef8de1b2b27949975ce96642149c6',
      indexName: 'vueuse',
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vueuse/vueuse' },
      { icon: 'twitter', link: 'https://twitter.com/vueuse' },
    ],

    nav: [
      {
        text: 'Guide',
        items: [
          { text: 'Guide', items: Guide },
          { text: 'Links', items: Links },
        ],
      },
      {
        text: 'Functions',
        items: indexes.categories
          .filter(f => !f.startsWith('@'))
          .map(c => ({
            text: c,
            activeMatch: '___', // never active
            link: `/functions#${c.toLowerCase()}`,
          })),
      },
      {
        text: 'Add-ons',
        link: '/add-ons',
      },
      {
        text: 'Playground',
        link: 'https://play.vueuse.org',
      },
      {
        text: `v${currentVersion}`,
        items: [
          {
            items: [
              { text: 'Release Notes', link: 'https://github.com/vueuse/vueuse/releases' },
              { text: 'What\'s news', link: '/recently-updated' },
            ],
          },
          {
            text: 'Versions',
            items: versions.map(i => i.version === currentVersion
              ? {
                text: `v${i.version} (Current)`,
                activeMatch: '/', // always active
                link: '/',
              }
              : {
                text: `v${i.version}`,
                link: i.link,
              },
            ),
          },
        ],

      },
    ],
    sidebar: {
      '/guide/': DefaultSideBar,
      '/contributing': DefaultSideBar,
      '/add-ons': DefaultSideBar,
      '/ecosystem': DefaultSideBar,
      '/guidelines': DefaultSideBar,
      '/export-size': DefaultSideBar,
      '/recent-updated': DefaultSideBar,

      '/functions': FunctionsSideBar,
      '/core/': FunctionsSideBar,
      '/shared/': FunctionsSideBar,
      '/router/': FunctionsSideBar,
      '/electron/': FunctionsSideBar,
      '/rxjs/': FunctionsSideBar,
      '/integrations/': FunctionsSideBar,
      '/firebase/': FunctionsSideBar,
    },
  },
  head: [
    ['meta', { name: 'theme-color', content: '#ffffff' }],
    ['link', { rel: 'icon', href: '/favicon-32x32.png', type: 'image/png' }],
    ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
    ['meta', { name: 'author', content: 'Anthony Fu' }],
    ['meta', { property: 'og:title', content: 'VueUse' }],
    ['meta', { property: 'og:image', content: 'https://vueuse.org/og.png' }],
    ['meta', { property: 'og:description', content: 'Collection of essential Vue Composition Utilities' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:creator', content: '@antfu7' }],
    ['meta', { name: 'twitter:image', content: 'https://vueuse.org/og.png' }],

    ['link', { rel: 'dns-prefetch', href: 'https://fonts.gstatic.com' }],
    ['link', { rel: 'preconnect', crossorigin: 'anonymous', href: 'https://fonts.gstatic.com' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Fira+Code&display=swap' }],
  ],
}

function getFunctionsSideBar() {
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
      items: functions.map(i => ({
        text: i.name,
        link: `/${i.package}/${i.name}/`,
      })),
      link: name.startsWith('@') ? `/${functions[0].package}/README` : undefined,
    })
  }

  return links
}

module.exports = config
