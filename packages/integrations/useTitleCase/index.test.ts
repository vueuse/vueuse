import { ref } from 'vue-demi'
import { useTitleCase } from '.'

describe('useTitleCase', () => {
  test('string', () => {
    const input = 'hello world'
    const titleCase = useTitleCase(input)
    expect(titleCase.value).toBe('Hello World')
    titleCase.value = 'vueuse'
    expect(titleCase.value).toBe('Vueuse')
  })
  test('ref string', () => {
    const input = ref('hello world')
    const titleCase = useTitleCase(input)
    expect(titleCase.value).toBe('Hello World')
    input.value = 'vueuse'
    expect(titleCase.value).toBe('Vueuse')
  })
})
