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
  const { categories } = indexes
  for (const name of categories) {
    if (name.startsWith('_'))
      continue

    const functions = indexes.functions.filter(i => i.category === name && !i.internal)

    links[name] = {
      text: name,
      children: functions.map(i => ({
        text: i.name,
        link: `/${i.package}/${i.name}/index.html`,
      })),
    }
  }
  return Object.values(links)
}
