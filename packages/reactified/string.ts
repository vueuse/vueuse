import { reactify } from '@vueuse/shared'

/*@__PURE__*/
export const toLowerCase = reactify((str: string) => str.toLowerCase())

/*@__PURE__*/
export const toUpperCase = reactify((str: string) => str.toUpperCase())

/*@__PURE__*/
export const slice = reactify((str: string, start: number, end?: number) => str.slice(start, end))
