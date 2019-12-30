import { init } from '../api'
import { useTimeout } from '..'

test('export', () => {
  init()
  const { ready } = useTimeout(10)
  expect(ready.value).toEqual(false)
  setTimeout(() => {
    expect(ready.value).toEqual(true)
  }, 10)
})
