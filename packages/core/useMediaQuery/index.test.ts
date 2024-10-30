import { describe, expect, it } from 'vitest'
import { nextTick, ref } from 'vue-demi'
import { useMediaQuery } from '.'

describe('useMediaQuery', () => {
  it('should be defined', () => {
    expect(useMediaQuery).toBeDefined()
  })

  it('should be false without window', () => {
    expect(useMediaQuery('(min-width: 0px)', { window: false }).value).toBe(false)
  })

  it('should support ssr media queries', async () => {
    const query = ref('(min-width: 500px)')
    const mediaQuery = useMediaQuery(query, { window: false, ssrSize: 500 })
    expect(mediaQuery.value).toBe(true)
    query.value = '(min-width: 501px)'
    await nextTick()
    expect(mediaQuery.value).toBe(false)

    query.value = '(min-width: 500px) and (max-width: 37rem)'
    await nextTick()
    expect(mediaQuery.value).toBe(true)

    query.value = '(max-width: 31rem)'
    await nextTick()
    expect(mediaQuery.value).toBe(false)

    query.value = '(max-width: 31rem), (min-width: 400px)'
    await nextTick()
    expect(mediaQuery.value).toBe(true)

    query.value = '(max-width: 31rem), not all and (min-width: 400px)'
    await nextTick()
    expect(mediaQuery.value).toBe(false)

    query.value = 'not all (min-width: 400px) and (max-width: 600px)'
    await nextTick()
    expect(mediaQuery.value).toBe(false)

    query.value = 'not all (max-width: 100px) and (min-width: 1000px)'
    await nextTick()
    expect(mediaQuery.value).toBe(true)
  })
})
