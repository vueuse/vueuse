import type { ComputedRef, Ref } from 'vue'
import { beforeEach, describe, expect, expectTypeOf, it } from 'vitest'
import { computed, ref as deepRef, isReadonly, shallowRef } from 'vue'
import { useTitle } from './index'

const defaultTitle = 'VueUse testing'

describe('useTitle', () => {
  beforeEach(() => {
    document.title = defaultTitle
  })

  it('without param', () => {
    const title = useTitle()
    expect(title.value).toEqual(defaultTitle)
    title.value = 'new title'
    expect(title.value).toEqual('new title')
  })

  describe('with writable param', () => {
    it('string', () => {
      const title = useTitle('old title')
      expect(title.value).toEqual('old title')
      title.value = 'new title'
      expect(title.value).toEqual('new title')
    })

    it('null', () => {
      const title = useTitle(null)
      expect(title.value).toEqual(defaultTitle)
      title.value = 'new title'
      expect(title.value).toEqual('new title')
    })

    it('undefined', () => {
      const title = useTitle(undefined)
      expect(title.value).toEqual(defaultTitle)
      title.value = 'new title'
      expect(title.value).toEqual('new title')
    })

    describe('ref param', () => {
      it('string', () => {
        const targetRef = shallowRef('old title')
        const title = useTitle(targetRef)
        expect(title.value).toEqual('old title')
        targetRef.value = 'new title'
        expect(title.value).toEqual('new title')
        title.value = 'latest title'
        expect(title.value).toEqual('latest title')
      })

      it('null', () => {
        const targetRef = deepRef<null | string>(null)
        const title = useTitle(targetRef)
        expect(title.value).toEqual(null)
        targetRef.value = 'new title'
        expect(title.value).toEqual('new title')
        title.value = 'latest title'
        expect(title.value).toEqual('latest title')
      })

      it('undefined', () => {
        const targetRef = deepRef<undefined | string>(undefined)
        const title = useTitle(targetRef)
        expect(title.value).toEqual(undefined)
        targetRef.value = 'new title'
        expect(title.value).toEqual('new title')
        title.value = 'latest title'
        expect(title.value).toEqual('latest title')
      })
    })
  })

  describe('with readonly param', () => {
    it('computed', () => {
      const condition = shallowRef(false)
      const target = computed(() => condition.value ? 'new title' : 'old title')
      const title = useTitle(target)
      expect(title.value).toEqual('old title')
      condition.value = true
      expect(title.value).toEqual('new title')
      expect(isReadonly(title)).toBeTruthy()
    })

    it('function', () => {
      const target = () => 'new title'
      const title = useTitle(target)
      expect(title.value).toEqual('new title')
      expect(isReadonly(title)).toBeTruthy()
    })
  })

  describe('types', () => {
    it('should return a ref if no default value', () => {
      const title = useTitle()
      expect(isReadonly(title)).toBeFalsy()
      expectTypeOf(title).toEqualTypeOf<Ref<string | null | undefined>>()
    })

    it('should return a computed if initial value is computed', () => {
      const title = useTitle(computed(() => ''))
      expect(isReadonly(title)).toBeTruthy()
      expectTypeOf(title).toEqualTypeOf<ComputedRef<string | null | undefined>>()
    })

    it('should return a ref if initial value is ref', () => {
      const title = useTitle(shallowRef(''))
      expect(isReadonly(title)).toBeFalsy()
      expectTypeOf(title).toEqualTypeOf<Ref<string | null | undefined>>()
    })

    it('should return a ref if initial value is string', () => {
      const title = useTitle('')
      expect(isReadonly(title)).toBeFalsy()
      expectTypeOf(title).toEqualTypeOf<Ref<string | null | undefined>>()
    })

    it('should return a ref if initial value is null', () => {
      const title = useTitle(null)
      expect(isReadonly(title)).toBeFalsy()
      expectTypeOf(title).toEqualTypeOf<Ref<string | null | undefined>>()
    })

    it('should return a ref if initial value is undefined', () => {
      const title = useTitle(undefined)
      expect(isReadonly(title)).toBeFalsy()
      expectTypeOf(title).toEqualTypeOf<Ref<string | null | undefined>>()
    })
  })
})
