import { renderHook } from '../../_docs/tests'
import { useTimeout } from '../useTimeout'

test('export', () => {
  renderHook(() => {})
  const { ready } = useTimeout(10)
  expect(ready.value).toEqual(false)
  setTimeout(() => {
    expect(ready.value).toEqual(true)
  }, 10)
})
