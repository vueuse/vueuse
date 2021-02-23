import { reactify } from '@vueuse/shared'
import YAML from 'js-yaml'

export const stringify = reactify((input: any) => YAML.dump(input, { skipInvalid: true }))
