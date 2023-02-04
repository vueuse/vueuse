import { ref } from 'vue-demi'
import { promiseTimeout } from '@vueuse/shared'
import { useDebounceValue } from '.'

describe('useDebounceValue', () => {
  test('Updates debounce value after every 100 ms', async () => {
    const v = ref('')
    const debouncedValue = useDebounceValue(v, 100)
    v.value = 'Hello'
    await promiseTimeout(100)
    expect(debouncedValue.value).toBe('')
    await promiseTimeout(100)
    expect(debouncedValue.value).toBe('Hello')
  })
})
