// eslint-disable-next-line no-restricted-imports
import * as vue from 'vue'

function getModuleExports(module: any, exclude?: string[]) {
  const exports = Object.keys(module)
  return exports.filter(name => !exclude?.includes(name))
}

export function generateGlobalDeclsFromModule(moduleName: string, exports: string[] = [], exportTypes: string[] = []) {
  const output: string[] = []

  if (exports.length > 0) {
    output.push(`declare global {
${exports
  .map(name => `const ${name}: typeof import('${moduleName}').${name};`)
  .join('\n')}
}`)
  }

  if (exportTypes.length > 0) {
    output.push(`declare global {
  export type { ${exportTypes.join(', ')} } from 'vue';
  import '${moduleName}';
}`)
  }

  output.push('export {};')

  return output.join('\n\n')
}

export function generateFileImports(moduleName: string, exports: string[] = [], exportTypes: string[] = []) {
  const output: string[] = []

  if (exports.length > 0) {
    output.push(`import { ${exports.join(', ')} } from '${moduleName}';`)
  }

  if (exportTypes.length > 0) {
    output.push(`import type { ${exportTypes.join(', ')} } from '${moduleName}';`)
  }

  return output.join('\n')
}

const vueExports = getModuleExports(vue)

// TODO: auto generate types
const vueTypes = ['Component', 'ComponentPublicInstance', 'ComputedRef', 'DirectiveBinding', 'ExtractDefaultPropTypes', 'ExtractPropTypes', 'ExtractPublicPropTypes', 'InjectionKey', 'PropType', 'Ref', 'MaybeRef', 'MaybeRefOrGetter', 'VNode', 'WritableComputedRef']

export const EXTRA_FILES = {
  'global-vue.ts': generateGlobalDeclsFromModule('vue', vueExports, vueTypes),
}

export const FILE_IMPORTS = generateFileImports('vue', vueExports, vueTypes)
