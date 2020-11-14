import fs from 'fs-extra'
import indexes from '../indexes.json'

async function buildRedirects() {
  const lines: string[] = []

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
