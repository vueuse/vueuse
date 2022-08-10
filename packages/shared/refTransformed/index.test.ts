import { ref } from 'vue-demi'
import { refTransformed } from '.'

describe('transformRef', () => {
  it('transforms', () => {
    const source = ref<string>()
    const target = refTransformed(
      source,
      input => (input === undefined ? NaN : parseFloat(input)),
      output => (isNaN(output) ? undefined : output.toString()),
    )

    // Initial value..
    expect(target.value).toBe(NaN)

    // Set source, get target.
    source.value = '12.5'
    expect(target.value).toBeCloseTo(12.5)

    source.value = 'bad'
    expect(target.value).toBe(NaN)

    // Set target, get source.
    target.value = 21.5
    expect(source.value).toBe('21.5')

    target.value = NaN
    expect(source.value).toBe(undefined)
  })
})
