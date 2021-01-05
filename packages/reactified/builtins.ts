import { reactifyObject } from '@vueuse/shared'

/*@__PURE__*/
export const JSON = reactifyObject(global.JSON)

/*@__PURE__*/
export const Math = reactifyObject(global.Math)

/*@__PURE__*/
export const console = reactifyObject(global.console)
