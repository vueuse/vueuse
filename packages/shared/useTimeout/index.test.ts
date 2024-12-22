import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { useTimeout } from '.'

describe('useTimeout', () => {
  it('works', () => {
    const ready = useTimeout(10)
    expect(ready.value).toEqual(false)
    setTimeout(() => expect(ready.value).toEqual(true), 10)
  })

  it('works with controls', () => {
    const { ready } = useTimeout(10, { controls: true })
    expect(ready.value).toEqual(false)
    setTimeout(() => expect(ready.value).toEqual(true), 10)
  })

  it('works with ref target', () => {
    const interval = ref(10)
    const ready = useTimeout(interval)
    expect(ready.value).toEqual(false)
    setTimeout(() => expect(ready.value).toEqual(true), 10)
  })

  it('works with controls and ref target', () => {
    const interval = ref(10)
    const { ready } = useTimeout(interval, { controls: true })
    expect(ready.value).toEqual(false)
    setTimeout(() => expect(ready.value).toEqual(true), 10)
  })
})
