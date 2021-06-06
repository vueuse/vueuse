import { useSetup } from '../../.test'
import { useTimeout } from '../useTimeout'

describe('useTimeout', () => {
  it('works', () => {
    useSetup(() => {})
    const ready = useTimeout(10)
    expect(ready.value).toEqual(false)
    setTimeout(() => expect(ready.value).toEqual(true), 10)
  })

  it('works with controls', () => {
    useSetup(() => {})
    const { ready } = useTimeout(10, { controls: true })
    expect(ready.value).toEqual(false)
    setTimeout(() => expect(ready.value).toEqual(true), 10)
  })
})
