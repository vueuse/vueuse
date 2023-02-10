import { useTimeout } from '../useTimeout'

describe('useTimeout', () => {
  it('works', () => {
    const ready = useTimeout(10)
    expect(ready.value).toBe(false)
    setTimeout(() => expect(ready.value).toBe(true), 10)
  })

  it('works with controls', () => {
    const { ready } = useTimeout(10, { controls: true })
    expect(ready.value).toBe(false)
    setTimeout(() => expect(ready.value).toBe(true), 10)
  })
})
