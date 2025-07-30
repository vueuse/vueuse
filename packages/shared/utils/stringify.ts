import type { CreateNodeOptions, DocumentOptions, ParseOptions, SchemaOptions, ToStringOptions } from 'yaml'
import { reactify } from '@vueuse/core'
import { stringify as _stringify } from 'yaml'

type YamlStringifyOptions = string | number | (DocumentOptions & SchemaOptions & ParseOptions & CreateNodeOptions & ToStringOptions)

const defaultOptions: YamlStringifyOptions = {
  singleQuote: true,
  flowCollectionPadding: false,
}

export function createReactifyStringify(options: YamlStringifyOptions = defaultOptions) {
  return reactify(
    (input: any) => _stringify(
      input,
      (_, v) => typeof v === 'function' ? undefined : v,
      options,
    ),
  )
}

export const yamlStringify = createReactifyStringify()
