import fg from 'fast-glob'
import fs from 'fs-extra'

export async function fix() {
  const names = await fg('packages/.vitepress/dist/**/*.html', { onlyFiles: true })

  await Promise.all(names.map(async(i) => {
    let html = await fs.readFile(i, 'utf-8')

    html = html.replace(
      '</head>',
      `
<link rel="manifest" href="/manifest.webmanifest">
<script>
if('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { scope: './' })
  })
}
</script>
</head>`).trim()

    await fs.writeFile(i, html, 'utf-8')
    // console.log(i)
  }))
}

fix()
