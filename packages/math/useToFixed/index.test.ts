import { ref } from 'vue-demi'
import { useToFixed } from '.'

describe('useToFixed', () => {
  it('should be defined', () => {
    expect(useToFixed).toBeDefined()
  })
  it('should work', () => {
    const base = ref(45.125)
    const result = useToFixed(base, 2)
    expect(result.value).toBe(45.13)
    base.value = -45.155
    expect(result.value).toBe(-45.15)
  })
  it('input string should work', () => {
    const base = ref('45.125')
    const result = useToFixed(base, 2)
    expect(result.value).toBe(45.13)
    base.value = '-45.155'
    expect(result.value).toBe(-45.15)
  })
  it('out string should work', () => {
    const base = ref('45.125')
    const result = useToFixed(base, 3, { type: 'string' })
    expect(result.value).toMatchInlineSnapshot('"45.125"')
    base.value = '-45.15'
    expect(result.value).toMatchInlineSnapshot('"-45.150"')
  })
  it('out ceil should work', () => {
    const base = ref('45.121')
    const result = useToFixed(base, 2, { math: 'ceil' })
    expect(result.value).toMatchInlineSnapshot('45.13')
    base.value = '-45.151'
    expect(result.value).toMatchInlineSnapshot('-45.15')
  })
  it('out floor should work', () => {
    const base = ref('45.129')
    const result = useToFixed(base, 2, { math: 'floor' })
    expect(result.value).toMatchInlineSnapshot('45.12')
    base.value = '-45.159'
    expect(result.value).toMatchInlineSnapshot('-45.16')
  })

  it('should return 0 if value is not valid number', () => {
    const empty = useToFixed(ref(''), 1, { math: 'ceil' })
    expect(empty.value).toBe(0)

    const word = useToFixed(ref('word'), 1, { math: 'floor' })
    expect(word.value).toBe(0)

    const emptyString = useToFixed(ref(''), 1, { type: 'string', math: 'floor' })
    expect(emptyString.value).toBe('0.0')

    const wordString = useToFixed(ref('word'), 1, { type: 'string', math: 'ceil' })
    expect(wordString.value).toBe('0.0')
  })
})
