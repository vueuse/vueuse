/* eslint-disable no-console */
import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import * as metadata from '@vueuse/metadata'
import { getTypeDefinition } from '../../scripts/utils'

type FunctionInvocation = 'AUTO' | 'EXTERNAL' | 'EXPLICIT_ONLY'

interface FunctionReference {
  name: string
  description: string
  reference: string
}

const r = (path: string) => fileURLToPath(new URL(path, import.meta.url))

const SKILL_DIR = r('./skills/vueuse-functions')
const SKILL_COPY_DIR = r('../../skills/vueuse-functions')
const SKILL_REFERENCE_DIR = './references'
const SKILLS_TEMPLATE_PATH = r('./templates/vueuse-functions-skills.md')
const VUEUSE_ROOT = r('../..')

const EXPLICIT_ONLY_FUNCTIONS = new Set([
  'get',
  'set',
  'toRef',
])

;(async () => {
  const categories = await prepareFunctionReferences(SKILL_DIR)
  const functionsTable = prepareFunctionsTable(categories)

  // Generate main skills markdown
  let templateContent = readFileSync(SKILLS_TEMPLATE_PATH, 'utf-8')
  templateContent = templateContent.replace('<!-- FUNCTIONS_TABLE_PLACEHOLDER -->', functionsTable)

  const outputPath = path.join(SKILL_DIR, 'SKILL.md')
  writeFileSync(outputPath, templateContent)

  console.log(`Generated skills documentation at: ${outputPath}`)

  // Copy to project root skills directory
  cpSync(SKILL_DIR, SKILL_COPY_DIR, { recursive: true, force: true })
  console.log(`Copied skills to: ${SKILL_COPY_DIR}`)
})()

// Utils

async function prepareFunctionReferences(outDir: string, referenceDir = SKILL_REFERENCE_DIR): Promise<Record<string, FunctionReference[]>> {
  mkdirSync(path.join(outDir, referenceDir), { recursive: true })

  const categories: Record<string, FunctionReference[]> = {}

  for (const category of metadata.categoryNames) {
    if (category.startsWith('_'))
      continue

    const refs: FunctionReference[] = []

    const functions = metadata.functions.filter(i => i.category === category && !i.internal)
    for (const fn of functions) {
      const description = toTitleCase(fn.description?.replace(/\|/g, '\\|') ?? '')

      if (fn.external) {
        refs.push({ name: fn.name, description, reference: fn.external })
        continue
      }

      const docPath = path.join(VUEUSE_ROOT, `packages/${fn.package}/${fn.name}/index.md`)
      if (existsSync(docPath)) {
        const outputPath = path.join(referenceDir, `${fn.name}.md`)
        const docContent = await genFunctionReference(fn.package, fn.name, docPath)
        writeFileSync(path.join(outDir, outputPath), docContent)
        refs.push({ name: fn.name, description, reference: outputPath })
      }
      else {
        console.warn(`Missing doc: ${fn.name}`)
      }
    }

    categories[category] = refs
  }
  return categories
}

function prepareFunctionsTable(categories: Record<string, FunctionReference[]>) {
  let table = ''

  for (const [category, functions] of Object.entries(categories)) {
    table += `### ${category}\n\n`
    table += `| Function | Description | Invocation |\n`
    table += `|----------|-------------|------------|\n`

    for (const fn of functions) {
      const invocation = resolveFunctionInvocation(fn.name, category)
      table += `| [\`${fn.name}\`](${fn.reference}) | ${fn.description} | ${invocation} |\n`
    }
    table += `\n`
  }

  return table
}

function resolveFunctionInvocation(name: string, category: string): FunctionInvocation {
  if (EXPLICIT_ONLY_FUNCTIONS.has(name)) {
    return 'EXPLICIT_ONLY'
  }
  if (category.startsWith('@')) {
    return 'EXTERNAL'
  }
  return 'AUTO'
}

function toTitleCase(str: string): string {
  if (!str)
    return str
  const first = str[0]
  if (first < 'a' || first > 'z')
    return str
  return first.toUpperCase() + str.slice(1)
}

async function genFunctionReference(pkg: string, name: string, mdPath: string) {
  const md = readFileSync(mdPath, 'utf-8')
  const types = await getTypeDefinition(pkg, name)
  if (types) {
    return `${md}
## Type Declarations

\`\`\`ts
${types}
\`\`\`
`
  }
  return md
}
