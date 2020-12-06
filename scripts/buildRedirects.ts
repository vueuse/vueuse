import fs from 'fs-extra'
import indexes from '../indexes.json'

const fixed = [
  ['/guide', '/?path=/story/docs--guide', '302'],
  ['/install', '/?path=/story/docs--installation', '302'],
  ['/size', '/?path=/story/docs--export-size', '302'],
].map(i => i.join('\t'))

async function buildRedirects() {
  const lines: string[] = [
    ...fixed,
  ]

  Object.values(indexes)
    .forEach(i => Object.values(i.categories)
      .forEach((i: any) =>
        i.filter(i => i.docs)
          .forEach(i =>
            lines.push(`/${i.name}\t${i.docs}\t302`),
          ),
      ),
    )

  const redirects = `${lines.join('\n')}\n`

  await fs.writeFile('storybook-static/_redirects', redirects, 'utf-8')
}

buildRedirects()
