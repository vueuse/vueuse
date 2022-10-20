import { nextTick } from 'vue-demi'
import { del, get, set, update } from 'idb-keyval'
import { useIDBKeyval } from '.'

const KEY = 'vue-use-idb-keyval'

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

describe('useIDBKeyval', () => {
  it('set/get', async () => {
    const state = useIDBKeyval(KEY, defaultState)
    await nextTick()
    expect(get).toHaveBeenCalled()
    expect(set).toHaveBeenCalled()
    expect(state.value).toEqual(defaultState)
  })

  it('update', async () => {
    const state = useIDBKeyval(KEY, defaultState)
    state.value.name = 'Apple'
    state.value.color = 'Red'
    state.value.size = 'Giant'
    state.value.count += 1

    await nextTick()
    expect(update).toHaveBeenCalled()

    expect(state.value.name).toBe('Apple')
    expect(state.value.color).toBe('Red')
    expect(state.value.size).toBe('Giant')
    expect(state.value.count).toBe(1)
  })

  it('del', async () => {
    const state = useIDBKeyval(KEY, defaultState)
    state.value = null
    await nextTick()
    expect(del).toHaveBeenCalled()
  })

  it('string', async () => {
    const state = useIDBKeyval(KEY, 'foo')
    expect(get).toHaveBeenCalled()
    expect(set).toHaveBeenCalled()
    expect(state.value).toEqual('foo')
    state.value = 'bar'
    expect(state.value).toEqual('bar')
    expect(update).toHaveBeenCalled()
  })
})
