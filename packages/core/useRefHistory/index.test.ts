import { ref, nextTick } from 'vue-demi'
import { useRefHistory } from '.'
import { renderHook } from '../../_docs/tests'

describe('useRefHistory - sync', () => {
  test('sync: should record', () => {
    renderHook(() => {
      const v = ref(0)
      const { history } = useRefHistory(v, { flush: 'sync' })

      expect(history.value.length).toBe(1)
      expect(history.value[0].value).toBe(0)

      v.value = 2

      expect(history.value.length).toBe(2)
      expect(history.value[0].value).toBe(2)
      expect(history.value[1].value).toBe(0)
    })
  })

  test('sync: should be able to undo and redo', () => {
    renderHook(() => {
      const v = ref(0)
      const { undo, redo, history } = useRefHistory(v, { flush: 'sync' })

      v.value = 2
      v.value = 3
      v.value = 4

      expect(v.value).toBe(4)
      expect(history.value.length).toBe(4)
      undo()
      expect(v.value).toBe(3)
      undo()
      expect(v.value).toBe(2)
      redo()
      expect(v.value).toBe(3)
      redo()
      expect(v.value).toBe(4)
      redo()
      expect(v.value).toBe(4)
    })
  })

  test('sync: object with deep', () => {
    renderHook(() => {
      const v = ref({ foo: 'bar' })
      const { history } = useRefHistory(v, { flush: 'sync', deep: true })

      expect(history.value.length).toBe(1)
      expect(history.value[0].value.foo).toBe('bar')

      v.value.foo = 'foo'

      expect(history.value.length).toBe(2)
      expect(history.value[0].value.foo).toBe('foo')

      // different references
      expect(history.value[1].value.foo).toBe('bar')
      expect(history.value[0].value).not.toBe(history.value[1].value)
    })
  })

  test('sync: dump + parse', () => {
    renderHook(() => {
      const v = ref({ a: 'bar' })
      const { history, undo } = useRefHistory(v, {
        flush: 'sync',
        deep: true,
        dump: v => JSON.stringify(v),
        parse: (v: string) => JSON.parse(v),
      })

      expect(history.value.length).toBe(1)
      expect(history.value[0].value).toBe('{"a":"bar"}')

      v.value.a = 'foo'

      expect(history.value.length).toBe(2)
      expect(history.value[0].value).toBe('{"a":"foo"}')
      expect(history.value[1].value).toBe('{"a":"bar"}')

      undo()

      expect(v.value.a).toBe('bar')
    })
  })

  test('sync: commit', () => {
    const v = ref(0)
    const { commit, history } = useRefHistory(v, { flush: 'sync' })

    expect(history.value.length).toBe(1)
    expect(history.value[0].value).toBe(0)

    commit()

    expect(history.value.length).toBe(2)
    expect(history.value[0].value).toBe(0)
    expect(history.value[1].value).toBe(0)
  })

  test('sync: without batch', () => {
    const v = ref({ foo: 1, bar: 'one' })
    const { history } = useRefHistory(v, { flush: 'sync', deep: true })

    expect(history.value.length).toBe(1)
    expect(history.value[0].value).toEqual({ foo: 1, bar: 'one' })

    v.value.foo = 2
    v.value.bar = 'two'

    expect(history.value.length).toBe(3)
    expect(history.value[0].value).toEqual({ foo: 2, bar: 'two' })
    expect(history.value[1].value).toEqual({ foo: 2, bar: 'one' })
    expect(history.value[2].value).toEqual({ foo: 1, bar: 'one' })
  })

  test('sync: with batch', () => {
    const v = ref({ foo: 1, bar: 'one' })
    const { history, batch } = useRefHistory(v, { flush: 'sync', deep: true })

    expect(history.value.length).toBe(1)
    expect(history.value[0].value).toEqual({ foo: 1, bar: 'one' })

    batch(() => {
      v.value.foo = 2
      v.value.bar = 'two'
    })

    expect(history.value.length).toBe(2)
    expect(history.value[0].value).toEqual({ foo: 2, bar: 'two' })
    expect(history.value[1].value).toEqual({ foo: 1, bar: 'one' })
  })

  test('sync: pause and resume', () => {
    const v = ref(1)
    const { history, pause, resume } = useRefHistory(v, { flush: 'sync' })

    expect(history.value.length).toBe(1)
    expect(history.value[0].value).toBe(1)

    pause()
    v.value = 2

    expect(history.value.length).toBe(1)

    resume()

    expect(history.value.length).toBe(1)

    v.value = 3

    expect(history.value.length).toBe(2)
    expect(history.value[0].value).toBe(3)
  })

  test('sync: reset', () => {
    renderHook(() => {
      const v = ref(0)
      const { history, undoStack, redoStack, pause, reset, undo } = useRefHistory(v, { flush: 'sync' })

      expect(history.value.length).toBe(1)
      expect(history.value[0].value).toBe(0)

      v.value = 1

      pause()

      v.value = 2

      expect(history.value.length).toBe(2)
      expect(history.value[0].value).toBe(1)
      expect(history.value[1].value).toBe(0)

      reset()

      // v value needs to be the last history point, but history is unchanged
      expect(v.value).toBe(1)

      expect(history.value.length).toBe(2)
      expect(history.value[0].value).toBe(1)
      expect(history.value[1].value).toBe(0)

      reset()

      // Calling reset twice is a no-op
      expect(v.value).toBe(1)

      expect(history.value.length).toBe(2)
      expect(history.value[1].value).toBe(0)
      expect(history.value[0].value).toBe(1)

      // Same test, but with a non empty redoStack

      undo()

      v.value = 2

      reset()

      expect(v.value).toBe(0)

      expect(undoStack.value.length).toBe(1)
      expect(undoStack.value[0].value).toBe(0)

      expect(redoStack.value.length).toBe(1)
      expect(redoStack.value[0].value).toBe(1)
    })
  })
})

describe('useRefHistory - pre', () => {
  test('pre: should record', async() => {
    const v = ref(0)
    const { history } = useRefHistory(v)

    expect(history.value.length).toBe(1)
    expect(history.value[0].value).toBe(0)

    v.value = 2
    await nextTick()

    expect(history.value.length).toBe(2)
    expect(history.value[0].value).toBe(2)
    expect(history.value[1].value).toBe(0)
  })

  test('pre: should be able to undo and redo', async() => {
    const v = ref(0)
    const { undo, redo, history } = useRefHistory(v)

    v.value = 2
    await nextTick()
    v.value = 3
    await nextTick()
    v.value = 4
    await nextTick()

    expect(v.value).toBe(4)
    expect(history.value.length).toBe(4)
    undo()
    await nextTick()
    expect(v.value).toBe(3)
    undo()
    await nextTick()
    expect(v.value).toBe(2)
    redo()
    await nextTick()
    expect(v.value).toBe(3)
    redo()
    await nextTick()
    expect(v.value).toBe(4)
    redo()
    await nextTick()
    expect(v.value).toBe(4)
  })

  test('pre: object with deep', async() => {
    const v = ref({ foo: 'bar' })
    const { history } = useRefHistory(v, { deep: true })

    expect(history.value.length).toBe(1)
    expect(history.value[0].value.foo).toBe('bar')

    v.value.foo = 'foo'
    await nextTick()

    expect(history.value.length).toBe(2)
    expect(history.value[0].value.foo).toBe('foo')

    // different references
    expect(history.value[1].value.foo).toBe('bar')
    expect(history.value[0].value).not.toBe(history.value[1].value)
  })

  test('pre: dump + parse', async() => {
    const v = ref({ a: 'bar' })
    const { history, undo } = useRefHistory(v, {
      deep: true,
      dump: v => JSON.stringify(v),
      parse: (v: string) => JSON.parse(v),
    })

    expect(history.value.length).toBe(1)
    expect(history.value[0].value).toBe('{"a":"bar"}')

    v.value.a = 'foo'
    await nextTick()

    expect(history.value.length).toBe(2)
    expect(history.value[0].value).toBe('{"a":"foo"}')
    expect(history.value[1].value).toBe('{"a":"bar"}')

    undo()
    await nextTick()

    expect(v.value.a).toBe('bar')
  })

  test('pre: commit', async() => {
    const v = ref(0)
    const { commit, history, undo } = useRefHistory(v)

    expect(history.value.length).toBe(1)
    expect(history.value[0].value).toBe(0)

    commit()

    expect(history.value.length).toBe(2)
    expect(history.value[0].value).toBe(0)
    expect(history.value[1].value).toBe(0)

    undo()
    v.value = 2
    commit()
    await nextTick()

    expect(history.value.length).toBe(2)
    expect(history.value[0].value).toBe(2)
    expect(history.value[1].value).toBe(0)
  })

  test('pre: pause and resume', async() => {
    const v = ref(1)
    const { history, pause, resume } = useRefHistory(v)

    expect(history.value.length).toBe(1)
    expect(history.value[0].value).toBe(1)

    pause()
    v.value = 2
    await nextTick()

    expect(history.value.length).toBe(1)

    resume()
    await nextTick()

    expect(history.value.length).toBe(1)

    v.value = 3
    await nextTick()

    expect(history.value.length).toBe(2)
    expect(history.value[0].value).toBe(3)
  })

  test('pre: reset', async() => {
    const v = ref(0)
    const { history, undoStack, redoStack, pause, reset, undo } = useRefHistory(v)

    expect(history.value.length).toBe(1)
    expect(history.value[0].value).toBe(0)

    v.value = 1
    await nextTick()

    pause()

    v.value = 2
    await nextTick()

    expect(history.value.length).toBe(2)
    expect(history.value[0].value).toBe(1)
    expect(history.value[1].value).toBe(0)

    reset()

    // v value needs to be the last history point, but history is unchanged
    expect(v.value).toBe(1)

    expect(history.value.length).toBe(2)
    expect(history.value[0].value).toBe(1)
    expect(history.value[1].value).toBe(0)

    reset()

    // Calling reset twice is a no-op
    expect(v.value).toBe(1)

    expect(history.value.length).toBe(2)
    expect(history.value[1].value).toBe(0)
    expect(history.value[0].value).toBe(1)

    // Same test, but with a non empty redoStack

    undo()
    await nextTick()

    v.value = 2
    await nextTick()

    reset()
    await nextTick()

    expect(v.value).toBe(0)

    expect(undoStack.value.length).toBe(1)
    expect(undoStack.value[0].value).toBe(0)

    expect(redoStack.value.length).toBe(1)
    expect(redoStack.value[0].value).toBe(1)
  })

  test('pre: auto batching', async() => {
    const v = ref(0)
    const { history } = useRefHistory(v)

    expect(history.value.length).toBe(1)
    expect(history.value[0].value).toBe(0)

    v.value = 1

    expect(history.value.length).toBe(1)
    await nextTick()
    expect(history.value.length).toBe(2)

    v.value += 1
    v.value += 1

    expect(history.value.length).toBe(2)
    await nextTick()
    expect(history.value.length).toBe(3)
    expect(history.value[0].value).toBe(3)
    expect(history.value[1].value).toBe(1)

    await nextTick()
    expect(history.value.length).toBe(3)
  })
})
