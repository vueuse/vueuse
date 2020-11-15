import { ref, nextTick } from 'vue-demi'
import { ignorableWatch } from '.'
import { renderHook } from '../../_tests'

describe('ignorableWatch', () => {
  test('ignore async updates', async() => {
    const source = ref(0)
    const target = ref(0)
    const { ignoreUpdates } = ignorableWatch(source, value => target.value = value)

    source.value = 1

    await nextTick()
    expect(target.value).toBe(1)

    ignoreUpdates(() => {
      source.value = 2
      source.value = 3
    })

    await nextTick()
    expect(target.value).toBe(1)

    ignoreUpdates(() => {
      source.value = 4
    })
    source.value = 5

    await nextTick()
    expect(target.value).toBe(5)
  })

  test('ignore prev async updates', async() => {
    const source = ref(0)
    const target = ref(0)
    const { ignorePrevAsyncUpdates } = ignorableWatch(source, value => target.value = value)

    source.value = 1

    await nextTick()
    expect(target.value).toBe(1)

    source.value = 2
    source.value = 3
    ignorePrevAsyncUpdates()

    await nextTick()
    expect(target.value).toBe(1)

    source.value = 4
    ignorePrevAsyncUpdates()
    source.value = 5

    await nextTick()
    expect(target.value).toBe(5)
  })

  test('ignore sync updates', () => {
    renderHook(() => {
      const source = ref(0)
      const target = ref(0)
      const { ignoreUpdates } = ignorableWatch(source, value => target.value = value, { flush: 'sync' })

      source.value = 1

      expect(target.value).toBe(1)

      ignoreUpdates(() => {
        source.value = 2
        source.value = 3
      })

      expect(target.value).toBe(1)

      ignoreUpdates(() => {
        source.value = 4
      })
      source.value = 5

      expect(target.value).toBe(5)
    })
  })
})
