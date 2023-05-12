import * as ts from 'typescript'
import type { Plugin } from 'vite'
import { functionNames } from '../../../packages/metadata/metadata'

export function TypescriptTranspileTransform(): Plugin {
  return {
    name: 'vueuse-ts-to-js-transform',
    enforce: 'pre',
    async transform(code, id) {
      if (!id.match(/\.md\b/))
        return null

      const tsPattern = /<div class="ts-api">\n\n\`\`\`typescript([\s\S]*?)\`\`\`\n\n<\/div>/g
      const transpileOptions = {
        module: ts.ModuleKind.ESNext,
        target: ts.ScriptTarget.ES2017,
        moduleResolution: ts.ModuleResolutionKind.Node10,
        esModuleInterop: true,
        sourceMap: false,
        declaration: false,
      }
      const [_, _name, i] = id.split('/').slice(-3)
      const name = functionNames.find(n => n.toLowerCase() === _name.toLowerCase()) || _name

      if (functionNames.includes(name) && i === 'index.md') {
        code = code.replace(tsPattern, (_, tsCode) => {
          let jsCode = ts.transpileModule(tsCode.trim(), { compilerOptions: transpileOptions }).outputText
          jsCode = jsCode.replace(/\.ts/, '.js')
          return `
<div class="ts-api">

\`\`\`typescript
${tsCode}
\`\`\`

</div>

<div class="js-api">

\`\`\`js
${jsCode}
\`\`\`

</div>

          `
        })
      }
      return code
    },
  }
}
