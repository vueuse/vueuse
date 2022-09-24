import { nextTick, reactive, ref } from 'vue-demi'
import { watchTriggerable } from '.'
describe('watchTriggerable', () => {
  test('this should work', async () => {
    const source = ref(0)
    const effect = ref(0)
    let cleanupCount = -1
    const { trigger } = watchTriggerable(source, (value, oldValue, onCleanup) => {
      onCleanup(() => {
        cleanupCount = value
      })
      expect(value).toBe(source.value)
      effect.value = value
    })

    // By default watch will be executed on the next tick
    source.value = 1
    expect(effect.value).toBe(0)
    await nextTick()
    expect(effect.value).toBe(source.value)
    expect(cleanupCount).toBe(-1)

    source.value = 2
    expect(cleanupCount).toBe(-1)
    await nextTick()
    expect(effect.value).toBe(source.value)
    expect(cleanupCount).toBe(1)

    // trigger is executed immediately
    effect.value = 0
    trigger()
    expect(effect.value).toBe(source.value)
    expect(cleanupCount).toBe(2)
  })

  test('source array', async () => {
    const source1 = ref(0)
    const source2 = reactive({ a: 'a' })
    const effect1 = ref(-1)
    const effect2 = ref('z')
    let cleanupCount = -1
    const { trigger } = watchTriggerable([source1, () => source2.a], ([value1, value2], [old1, old2], onCleanup) => {
      onCleanup(() => {
        cleanupCount = value1
      })
      expect(value1).toBe(source1.value)
      effect1.value = value1
      effect2.value = value2
    })

    trigger()
    expect(effect1.value).toBe(source1.value)
    expect(effect2.value).toBe(source2.a)
    expect(cleanupCount).toBe(-1)

    source1.value = 1
    source2.a = 'b'
    await nextTick()
    expect(effect1.value).toBe(source1.value)
    expect(effect2.value).toBe(source2.a)
    expect(cleanupCount).toBe(0)
  })

  test('source reactive object', async () => {
    const source = reactive({ a: 'a' })
    const effect = ref('')
    let cleanupCount = 0
    const { trigger } = watchTriggerable(source, (value, old, onCleanup) => {
      onCleanup(() => {
        cleanupCount += 1
      })
      expect(value).toBe(source)
      effect.value = value.a
    })

    trigger()
    expect(effect.value).toBe(source.a)
    expect(cleanupCount).toBe(0)

    source.a = 'b'
    await nextTick()
    expect(effect.value).toBe(source.a)
    expect(cleanupCount).toBe(1)
  })

  test('trigger should await', async () => {
    const source = ref(1)
    const effect = ref(0)
    const { trigger } = watchTriggerable(source, async (value) => {
      await new Promise(resolve => setTimeout(resolve, 10))
      effect.value = value
    })

    await trigger()
    expect(effect.value).toBe(source.value)
  })
})
