// copied from vue: https://github.com/vuejs/core/blob/3be4e3cbe34b394096210897c1be8deeb6d748d8/packages/shared/src/general.ts#L90-L112
function cacheStringFunction<T extends (str: string) => string>(fn: T): T {
  const cache: Record<string, string> = Object.create(null)
  return ((str: string) => {
    const hit = cache[str]
    return hit || (cache[str] = fn(str))
  }) as T
}

const hyphenateRE = /\B([A-Z])/g
export const hyphenate = cacheStringFunction((str: string) => str.replace(hyphenateRE, '-$1').toLowerCase())

const camelizeRE = /-(\w)/g
export const camelize = cacheStringFunction((str: string): string => {
  return str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ''))
})
