import { isReactive, ref } from 'vue-demi'
import { describe, expect, it } from 'vitest'
import { useManualRefHistory } from '.'

const wait = (ms = 50) => new Promise(r => setTimeout(r, ms))

describe('useManualRefHistory async mode', () => {
  it('should record', async () => {
    const v = ref(0)
    const { history, commit } = useManualRefHistory(v, { async: true })

    expect(history.value.length).toBe(1)
    expect(history.value[0].snapshot).toBe(0)

    v.value = 2
    await commit()

    expect(history.value.length).toBe(2)
    expect(history.value[0].snapshot).toBe(2)
    expect(history.value[1].snapshot).toBe(0)
  })

  it('should be able to undo and redo', async () => {
    const v = ref(0)

    const { commit, undo, redo, clear, canUndo, canRedo, history, last } = useManualRefHistory(v, { async: true })

    await wait()

    expect(canUndo.value).toBe(false)
    expect(canRedo.value).toBe(false)

    v.value = 2
    await commit()
    v.value = 3
    await commit()
    v.value = 4
    await commit()

    expect(canUndo.value).toBe(true)
    expect(canRedo.value).toBe(false)

    expect(v.value).toBe(4)
    expect(history.value.length).toBe(4)
    expect(last.value.snapshot).toBe(4)
    await undo()

    expect(canUndo.value).toBe(true)
    expect(canRedo.value).toBe(true)

    expect(v.value).toBe(3)
    expect(last.value.snapshot).toBe(3)
    await undo()
    expect(v.value).toBe(2)
    expect(last.value.snapshot).toBe(2)
    await redo()
    expect(v.value).toBe(3)
    expect(last.value.snapshot).toBe(3)
    await redo()
    expect(v.value).toBe(4)
    expect(last.value.snapshot).toBe(4)

    expect(canUndo.value).toBe(true)
    expect(canRedo.value).toBe(false)

    await redo()
    expect(v.value).toBe(4)
    expect(last.value.snapshot).toBe(4)

    clear()
    expect(canUndo.value).toBe(false)
    expect(canRedo.value).toBe(false)
  })

  it('object with deep', async () => {
    const v = ref({ foo: 'bar' })
    const { commit, undo, history } = useManualRefHistory(v, {
      async: true,
      clone: true,
    })

    await wait()

    expect(history.value.length).toBe(1)
    expect(history.value[0].snapshot.foo).toBe('bar')

    v.value.foo = 'foo'
    await commit()

    expect(history.value.length).toBe(2)
    expect(history.value[0].snapshot.foo).toBe('foo')

    // different references
    expect(history.value[1].snapshot.foo).toBe('bar')
    expect(history.value[0].snapshot).not.toBe(history.value[1].snapshot)

    await undo()

    // history references should not be equal to the source
    expect(history.value[0].snapshot).not.toBe(v.value)
  })

  it('object with clone function', async () => {
    const v = ref({ foo: 'bar' })
    const { commit, undo, history } = useManualRefHistory(v, { async: true, clone: x => JSON.parse(JSON.stringify(x)) })

    await wait()

    expect(history.value.length).toBe(1)
    expect(history.value[0].snapshot.foo).toBe('bar')

    v.value.foo = 'foo'
    await commit()

    expect(history.value.length).toBe(2)
    expect(history.value[0].snapshot.foo).toBe('foo')

    // different references
    expect(history.value[1].snapshot.foo).toBe('bar')
    expect(history.value[0].snapshot).not.toBe(history.value[1].snapshot)

    await undo()

    // history references should not be equal to the source
    expect(history.value[0].snapshot).not.toBe(v.value)
  })

  it('dump + parse', async () => {
    const v = ref({ a: 'bar' })
    const { history, commit, undo } = useManualRefHistory(v, {
      async: true,
      dump: async v => JSON.stringify(await v),
      parse: async (v: string) => JSON.parse(v),
    })

    await wait()

    expect(history.value.length).toBe(1)
    expect(history.value[0].snapshot).toBe('{"a":"bar"}')

    v.value.a = 'foo'
    await commit()

    expect(history.value.length).toBe(2)
    expect(history.value[0].snapshot).toBe('{"a":"foo"}')
    expect(history.value[1].snapshot).toBe('{"a":"bar"}')

    await undo()

    expect(v.value.a).toBe('bar')
  })

  it('reset', async () => {
    const v = ref(0)
    const { history, commit, undoStack, redoStack, reset, undo } = useManualRefHistory(v, { async: true })

    await wait()

    expect(history.value.length).toBe(1)
    expect(history.value[0].snapshot).toBe(0)

    v.value = 1
    await commit()

    v.value = 2

    expect(history.value.length).toBe(2)
    expect(history.value[0].snapshot).toBe(1)
    expect(history.value[1].snapshot).toBe(0)

    await reset()

    // v value needs to be the last history point, but history is unchanged
    expect(v.value).toBe(1)

    expect(history.value.length).toBe(2)
    expect(history.value[0].snapshot).toBe(1)
    expect(history.value[1].snapshot).toBe(0)

    await reset()

    // Calling reset twice is a no-op
    expect(v.value).toBe(1)

    expect(history.value.length).toBe(2)
    expect(history.value[1].snapshot).toBe(0)
    expect(history.value[0].snapshot).toBe(1)

    // Same test, but with a non empty redoStack

    v.value = 3
    await commit()

    await undo()

    v.value = 2

    await reset()

    expect(v.value).toBe(1)

    expect(undoStack.value.length).toBe(1)
    expect(undoStack.value[0].snapshot).toBe(0)

    expect(redoStack.value.length).toBe(1)
    expect(redoStack.value[0].snapshot).toBe(3)
  })

  it('snapshots should not be reactive', async () => {
    const v = ref(0)
    const { history, commit } = useManualRefHistory(v, { async: true })

    await wait()

    expect(history.value.length).toBe(1)
    expect(history.value[0].snapshot).toBe(0)

    v.value = 2
    await commit()

    expect(isReactive(history.value[0])).toBe(false)
    expect(isReactive(history.value[1])).toBe(false)
  })
})
