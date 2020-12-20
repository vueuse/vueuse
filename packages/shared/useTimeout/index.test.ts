import { useSetup } from '../../_tests'
import { useTimeout } from '../useTimeout'

test('export', () => {
  useSetup(() => {})
  const { ready } = useTimeout(10)
  expect(ready.value).toEqual(false)
  setTimeout(() => {
    expect(ready.value).toEqual(true)
  }, 10)
})
