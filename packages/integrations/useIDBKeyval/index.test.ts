import { del, get, set, update } from 'idb-keyval'
import { useIDBKeyval } from '.'

const defaultState = {
  name: 'Banana',
  color: 'Yellow',
  size: 'Medium',
  count: 0,
}

beforeEach(() => {
  vi.unmock('idb-keyval')
  vi.mock('idb-keyval')
})

// describe('useIDBKeyval', () => {
//   it('watches deep changes', () => {

//   })

//   it('calls onError when an error is thrown', () => {

//   })

//   it('can use a shallowRef', () => {

//   })
// })
it('works', () => {
  const state = useIDBKeyval('vue-use-idb-keyval', defaultState)

  state.value.name = 'Apple'
  state.value.color = 'Red'
  state.value.size = 'Giant'
  state.value.count++

  expect(state.value.name).toBe('Apple')
  expect(state.value.color).toBe('Red')
  expect(state.value.size).toBe('Giant')
  expect(state.value.count).toBe(defaultState.count + 1)
  // console.log(IDBKeyVal.del)
  expect(get).not.toHaveBeenCalled()
})
