import { ref } from 'vue-demi'
import { reactivePick } from '.'
import { useSetup } from '../../.test'

describe('reactivePick', () => {
  it('should work with variadic parameters', () => {
    useSetup(() => {
      const object = { a: 'a', b: 'b' }
      const pickedObject = reactivePick(object, 'a', 'b')

      expect(pickedObject.a).toEqual('a')
      expect(pickedObject.b).toEqual('b')
      expect((pickedObject as any).c).toBeUndefined()

      object.a = 'foo'

      expect(pickedObject.a).toEqual('foo')
    })
  })

  it('should prefer the variadic overload over the array one', () => {
    useSetup(() => {
      const object = { a: 'a', b: 'b' }
      const pickedObject = reactivePick(object, 'a')

      expect(pickedObject.a).toEqual('a')
    })
  })

  it('should work with non-ref key arrays', () => {
    useSetup(() => {
      const object = { a: 'a', b: 'b', c: 'c' }
      const pickedObject = reactivePick(object, ['a', 'b'])

      expect(pickedObject.a).toEqual('a')
      expect(pickedObject.b).toEqual('b')
      expect((pickedObject as any).c).toBeUndefined()

      object.a = 'foo'

      expect(pickedObject.a).toEqual('foo')
    })
  })

  it('should work with ref key arrays', () => {
    useSetup(() => {
      const object = { a: 'a', b: 'b', c: 'c' }
      const picks = ref(['a' as keyof typeof object])
      const pickedObject = reactivePick(object, picks)

      expect(pickedObject.a).toEqual('a')
      expect(pickedObject.b).toBeUndefined()

      object.a = 'foo'
      expect(pickedObject.a).toEqual('foo')

      picks.value.push('b')
      expect(pickedObject.b).toEqual('b')

      object.b = 'bar'
      expect(pickedObject.b).toEqual('bar')

      picks.value.splice(1, 1)
      expect(pickedObject.b).toBeUndefined()
    })
  })
})
