import type { UserConfig } from 'vitepress'
import indexes from '../../indexes.json'
import { currentVersion, versions } from '../../meta/versions'

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
  { text: 'Getting Started', link: '/guide/index' },
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

const DefaultSideBar = [
  { text: 'Guide', children: Guide },
  { text: 'Core Functions', children: Functions },
  { text: 'Add-ons', link: '/add-ons' },
  { text: 'Ecosystem', link: '/ecosystem' },
  { text: 'Export Size', link: '/export-size' },
  { text: 'Recently Updated', link: '/recently-updated' },
]

const FunctionsSideBar = getFunctionsSideBar()

const config: UserConfig = {
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
    nav: [
      // { text: 'Home', link: '/' },s
      {
        text: 'Guide',
        items: Guide,
      },
      {
        text: 'Functions',
        link: '/functions',
        items: indexes.categories
          .filter(f => !f.startsWith('@'))
          .map((c) => {
            return {
              text: c,
              activeMatch: '___', // never active
              link: `/functions#${c.toLowerCase()}`,
            }
          }),
      },
      {
        text: 'Add-ons',
        link: '/add-ons',
      },
      {
        text: 'More',
        items: [
          { text: 'Playground', link: 'https://play.vueuse.org' },
          { text: 'Ecosystem', link: '/ecosystem' },
          { text: 'Export Size', link: '/export-size' },
        ],
      },
      {
        text: `v${currentVersion}`,
        items: [
          { text: 'Release Notes', link: 'https://github.com/vueuse/vueuse/releases' },
          { text: 'What\'s new', link: '/recently-updated' },
          ...versions.map((i) => {
            if (i.version === currentVersion) {
              return {
                text: `v${i.version} (Current)`,
                activeMatch: '/', // always active
                link: '/',
              }
            }
            return {
              text: `v${i.version}`,
              link: i.link,
            }
          }),
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
      '/recently-updated': DefaultSideBar,

      '/functions': FunctionsSideBar,
      '/core/': FunctionsSideBar,
      '/shared/': FunctionsSideBar,
      '/router/': FunctionsSideBar,
      '/electron/': FunctionsSideBar,
      '/rxjs/': FunctionsSideBar,
      '/integrations/': FunctionsSideBar,
      '/firebase/': FunctionsSideBar,
    },
    algolia: {
      apiKey: 'a99ef8de1b2b27949975ce96642149c6',
      indexName: 'vueuse',
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
    ['link', { href: 'https://fonts.googleapis.com/css2?family=Fira+Code&display=swap', rel: 'stylesheet' }],
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
      children: functions.map(i => ({
        text: i.name,
        link: `/${i.package}/${i.name}/`,
      })),
      link: name.startsWith('@') ? `/${functions[0].package}/README` : undefined,
    })
  }

  return links
}

export default config
