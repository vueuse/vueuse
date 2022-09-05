import { useCloned } from '@vueuse/core'
import { expect } from 'vitest'
import { nextTick, ref } from 'vue-demi'

describe('useCloned', () => {
  it('works with simple objects', () => {
    const data = { test: 'test' }

    const { cloned, sync } = useCloned(data)

    expect(cloned.value).toEqual(data)

    cloned.value = { test: 'failed' }

    sync()

    expect(cloned.value).toEqual(data)
  })

  it('works with refs', async () => {
    const data = ref({ test: 'test' })

    const { cloned } = useCloned(data)

    data.value.test = 'success'

    await nextTick()

    expect(cloned.value).toEqual(data.value)
  })

  it('works with refs and manual sync', async () => {
    const data = ref({ test: 'test' })

    const { cloned, sync } = useCloned(data, { manual: true })

    data.value.test = 'success'

    expect(cloned.value).not.toEqual(data.value)

    sync()

    expect(cloned.value).toEqual(data.value)
  })

  it('works with custom clone function', async () => {
    const data = ref<Record<string, any>>({ test: 'test' })

    const { cloned } = useCloned(data, {
      clone: source => ({ ...source, proxyTest: true }),
    })

    data.value.test = 'partial'

    await nextTick()

    expect(cloned.value.test).toBe('partial')
    expect(cloned.value.proxyTest).toBe(true)
  })

  it('works with watch options', async () => {
    const data = ref({ test: 'test' })

    const { cloned } = useCloned(data, { immediate: false, deep: false })

    await nextTick()

    // test immediate: false
    expect(cloned.value).toEqual({})

    data.value.test = 'not valid'

    await nextTick()

    // test deep: false
    expect(cloned.value).toEqual({})

    data.value = { test: 'valid' }

    await nextTick()

    expect(cloned.value).toEqual(data.value)
  })
})
