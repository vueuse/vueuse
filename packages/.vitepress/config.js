const indexes = require('../../indexes.json')

module.exports = {
  title: 'VueUse',
  description: 'Collection of essential Vue Composition Utilities',
  themeConfig: {
    logo: '/android-chrome-512x512.png',
    repo: 'antfu/vueuse',
    docsDir: 'packages',
    editLinks: true,
    editLinkText: 'Edit this page on GitHub',
    lastUpdated: 'Last Updated',
    nav: [{ text: 'Home', link: '/' }],
    sidebar: getSideBar(),
  },
}

function getSideBar() {
  const links = {}
  for (const { info, categories } of Object.values(indexes)) {
    for (const [name, functions] of Object.entries(categories)) {
      if (name.startsWith('_'))
        continue

      if (!links[name]) {
        links[name] = {
          text: name.startsWith('/') ? `@${info.display}` : name,
          children: [],
        }
      }

      links[name].children.push(
        ...functions.map(i => ({
          text: i.name,
          link: `/${info.name}/${i.name}/index.html`,
        })),
      )
    }
  }
  return Object.values(links)
}
