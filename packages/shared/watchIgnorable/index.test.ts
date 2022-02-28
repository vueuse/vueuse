import { nextTick, ref } from 'vue-demi'
import { useSetup } from '../../.test'
import { watchIgnorable } from '.'

describe('watchIgnorable', () => {
  test('ignore async updates', async() => {
    const source = ref(0)
    const target = ref(0)
    const { ignoreUpdates } = watchIgnorable(source, value => target.value = value)

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
    const { ignorePrevAsyncUpdates } = watchIgnorable(source, value => target.value = value)

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
    useSetup(() => {
      const source = ref(0)
      const target = ref(0)
      const { ignoreUpdates } = watchIgnorable(source, value => target.value = value, { flush: 'sync' })

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
