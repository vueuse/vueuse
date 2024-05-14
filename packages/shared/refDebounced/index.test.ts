import { describe, expect, it } from 'vitest'
import { ref } from 'vue-demi'
import { refDebounced } from '@vueuse/shared'

describe('refDebounced', () => {
  it('should debounce updates of a ref', async () => {
    const source = ref('John')
    const debounced = refDebounced(source, 10)

    expect(debounced.value).toBe('John')

    source.value = 'Jack'

    expect(debounced.value).toBe('John')

    await new Promise(resolve => setTimeout(resolve, 20))

    expect(debounced.value).toBe('Jack')
  })

  it('should debounce updates of an object ref', async () => {
    const source = ref({ name: 'John' })
    const debounced = refDebounced(source, 10, { deep: true })

    expect(debounced.value.name).toBe('John')

    source.value.name = 'Jack'

    expect(debounced.value.name).toBe('John')

    await new Promise(resolve => setTimeout(resolve, 20))

    expect(debounced.value.name).toBe('Jack')
  })

  it('should debounce updates of a nested object ref', async () => {
    const source = ref({ user: { name: 'John' } })
    const debounced = refDebounced(source, 10, { deep: true })

    expect(debounced.value.user.name).toBe('John')

    source.value.user.name = 'Jack'

    expect(debounced.value.user.name).toBe('John')

    await new Promise(resolve => setTimeout(resolve, 20))

    expect(debounced.value.user.name).toBe('Jack')
  })
})
