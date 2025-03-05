import { reactify } from '@vueuse/shared'
import YAML from 'yaml'

export const stringify = reactify(
  (input: any) => YAML.stringify(input, {
    singleQuote: true,
    flowCollectionPadding: false,
  }),
)
