const path = require('path')
const fs = require('fs-extra')
const parser = require('prettier/parser-typescript')
const prettier = require('prettier/standalone')

module.exports = function (source, u) {
  let request = this._module.request

  request = request.replace(/\\/g, '/')

  if (!request.endsWith('/index.md'))
    return source

  const moduleName = path.basename(path.dirname(request))

  const typing = fs.readFileSync(path.resolve(__dirname, `../dist/esm/${moduleName}/index.d.ts`), 'utf-8')

  if (!typing)
    return source

  const text = typing
    .replace(/import\(.*?\)\./g, '')

  const formatted = prettier.format(text, { semi: false, parser: 'typescript', plugins: [parser] })

  return `${source}\n\n## Typing\n\n\`\`\`typescript\n${formatted.trim()}\n\`\`\`\n`
}
