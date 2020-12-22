const indexes = require('../../indexes.json')

module.exports = {
  title: 'VueUse',
  description: 'Collection of essential Vue Composition Utilities',
  themeConfig: {
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
  const links = []
  for (const { info, categories } of Object.values(indexes)) {
    const catLinks = []
    for (const [name, functions] of Object.entries(categories)) {
      if (name.startsWith('_'))
        continue
      catLinks.push({
        text: name,
        children: functions.map(i => ({
          text: i.name,
          link: `/${info.name}/${i.name}/index.html`,
        })),
      })
    }

    // if (catLinks.length === 1) {
    //   links.push({
    //     text: info.display,
    //     children: catLinks[0].children,
    //   })
    // }
    // else {
    links.push({
      text: info.display,
      children: catLinks,
    })
    // }
  }
  return links
}
