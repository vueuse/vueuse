import { nextTick, ref } from 'vue-demi'
import { promiseTimeout } from '@vueuse/shared'
import { useDebouncedRefHistory } from '.'

describe('useDebouncedRefHistory', () => {
  test('Once the ref\'s value has changed and some time has passed, ensure the snapshot is updated', async () => {
    const v = ref(0)

    const { history } = useDebouncedRefHistory(v, { debounce: 10 })
    v.value = 100
    expect(history.value.length).toBe(1)
    expect(history.value[0].snapshot).toBe(0)

    await promiseTimeout(20)

    expect(history.value.length).toBe(2)
    expect(history.value[0].snapshot).toBe(100)
  })

  test('when debounce is undefined', async () => {
    const v = ref(0)

    const { history } = useDebouncedRefHistory(v, { deep: false })

    v.value = 100

    await nextTick()

    expect(history.value.length).toBe(2)
    expect(history.value[0].snapshot).toBe(100)
  })
})
