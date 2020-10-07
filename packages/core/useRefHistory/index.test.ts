import { ref } from 'vue-demi'
import { useRefHistory } from '.'
import { renderHook } from '../../_docs/tests'

describe('useRefHistory', () => {
  test('should record', () => {
    renderHook(() => {
      const v = ref(0)
      const { prev } = useRefHistory(v)

      expect(prev.length).toBe(1)
      expect(prev[0].value).toBe(0)

      v.value = 2

      expect(prev.length).toBe(2)
      expect(prev[0].value).toBe(2)
      expect(prev[1].value).toBe(0)
    })
  })

  test('should be able to undo and redo', () => {
    renderHook(() => {
      const v = ref(0)
      const { undo, redo, prev } = useRefHistory(v)

      v.value = 2
      v.value = 3
      v.value = 4

      expect(v.value).toBe(4)
      expect(prev.length).toBe(4)
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
      const { prev } = useRefHistory(v, { deep: true })

      expect(prev.length).toBe(1)
      expect(prev[0].value.foo).toBe('bar')

      v.value.foo = 'foo'

      expect(prev.length).toBe(2)
      expect(prev[0].value.foo).toBe('foo')

      // same reference
      expect(prev[1].value.foo).toBe('foo')
      expect(prev[0].value).toBe(prev[1].value)
    })
  })

  test('object with clone', () => {
    renderHook(() => {
      const v = ref({ foo: 'bar' })
      const { prev } = useRefHistory(v, { deep: true, clone: true })

      expect(prev.length).toBe(1)
      expect(prev[0].value.foo).toBe('bar')

      v.value.foo = 'foo'

      expect(prev.length).toBe(2)
      expect(prev[0].value.foo).toBe('foo')

      // different references
      expect(prev[1].value.foo).toBe('bar')
      expect(prev[0].value).not.toBe(prev[1].value)
    })
  })

  test('dump + parse', () => {
    renderHook(() => {
      const v = ref({ a: 'bar' })
      const { prev, undo } = useRefHistory(v, {
        deep: true,
        clone: true,
        dump: v => JSON.stringify(v),
        parse: (v: string) => JSON.parse(v),
      })

      expect(prev.length).toBe(1)
      expect(prev[0].value).toBe('{"a":"bar"}')

      v.value.a = 'foo'

      expect(prev.length).toBe(2)
      expect(prev[0].value).toBe('{"a":"foo"}')
      expect(prev[1].value).toBe('{"a":"bar"}')

      undo()

      expect(v.value.a).toBe('bar')
    })
  })
})
