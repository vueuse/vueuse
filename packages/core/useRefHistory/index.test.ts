import { ref } from 'vue-demi'
import { useRefHistory } from '.'
import { renderHook } from '../../_docs/tests'

describe('useRefHistory', () => {
  test('should record', () => {
    renderHook(() => {
      const v = ref(0)
      const { history } = useRefHistory(v)

      expect(history.length).toBe(1)
      expect(history[0].value).toBe(0)

      v.value = 2

      expect(history.length).toBe(2)
      expect(history[0].value).toBe(2)
      expect(history[1].value).toBe(0)
    })
  })

  test('should be able to undo and redo', () => {
    renderHook(() => {
      const v = ref(0)
      const { undo, redo, history } = useRefHistory(v)

      v.value = 2
      v.value = 3
      v.value = 4

      expect(v.value).toBe(4)
      expect(history.length).toBe(4)
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

  test('object', () => {
    renderHook(() => {
      const v = ref({ foo: 'bar' })
      const { history } = useRefHistory(v, { deep: true })

      expect(history.length).toBe(1)
      expect(history[0].value.foo).toBe('bar')

      v.value.foo = 'foo'

      expect(history.length).toBe(2)
      expect(history[0].value.foo).toBe('foo')

      // same reference
      expect(history[1].value.foo).toBe('foo')
      expect(history[0].value).toBe(history[1].value)
    })
  })

  test('object with clone', () => {
    renderHook(() => {
      const v = ref({ foo: 'bar' })
      const { history } = useRefHistory(v, { deep: true, clone: true })

      expect(history.length).toBe(1)
      expect(history[0].value.foo).toBe('bar')

      v.value.foo = 'foo'

      expect(history.length).toBe(2)
      expect(history[0].value.foo).toBe('foo')

      // different references
      expect(history[1].value.foo).toBe('bar')
      expect(history[0].value).not.toBe(history[1].value)
    })
  })

  test('dump + parse', () => {
    renderHook(() => {
      const v = ref({ a: 'bar' })
      const { history, undo } = useRefHistory(v, {
        deep: true,
        clone: true,
        dump: v => JSON.stringify(v),
        parse: (v: string) => JSON.parse(v),
      })

      expect(history.length).toBe(1)
      expect(history[0].value).toBe('{"a":"bar"}')

      v.value.a = 'foo'

      expect(history.length).toBe(2)
      expect(history[0].value).toBe('{"a":"foo"}')
      expect(history[1].value).toBe('{"a":"bar"}')

      undo()

      expect(v.value.a).toBe('bar')
    })
  })
})
