import './_init'
import { useTimeout } from '..'

test('export', () => {
  const { ready } = useTimeout(10)
  expect(ready.value).toEqual(false)
  setTimeout(() => {
    expect(ready.value).toEqual(true)
  }, 10)
})
