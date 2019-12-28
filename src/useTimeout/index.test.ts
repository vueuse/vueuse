import { testInit } from '../dev/tests'
import { useTimeout } from '..'

test('export', () => {
  testInit()
  const { ready } = useTimeout(10)
  expect(ready.value).toEqual(false)
  setTimeout(() => {
    expect(ready.value).toEqual(true)
  }, 10)
})
