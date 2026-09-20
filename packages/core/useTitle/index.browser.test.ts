import type { ComputedRef, Ref } from 'vue'
import { beforeEach, describe, expect, expectTypeOf, it } from 'vitest'
import { computed, ref as deepRef, isReadonly, nextTick, shallowRef } from 'vue'
import { useSetup } from '../../.test'
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

  describe('options params', () => {
    describe('titleTemplate', () => {
      it('string', () => {
        const title = useTitle('old title', { titleTemplate: '%s | My Website' })
        expect(document.title).toBe('old title | My Website')
        expect(title.value).toBe('old title')
      })

      it('empty string', () => {
        const title = useTitle('old title', { titleTemplate: '' })
        expect(document.title).toBe('old title')
        expect(title.value).toBe('old title')
      })

      it('function', async () => {
        const title = useTitle('old title', { titleTemplate: (title: string) => `${title} | My Website` })
        expect(document.title).toBe('old title | My Website')
        expect(title.value).toBe('old title')

        title.value = 'new title'
        await nextTick()
        expect(document.title).toBe('new title | My Website')
        expect(title.value).toBe('new title')
      })
    })

    describe('observe', () => {
      it('should not be updated if used default value', async () => {
        const title = useTitle('old title')

        document.title = 'new title'
        await nextTick()
        expect(title.value).toBe('old title')
      })

      it('should not be updated if observe is false', async () => {
        const title = useTitle('old title', { observe: false })

        document.title = 'new title'
        await nextTick()
        expect(title.value).toBe('old title')
      })

      it('should be update if document.title changes', async () => {
        const title = useTitle('old title', { observe: true })

        document.title = 'new title'
        await nextTick()
        expect(title.value).toBe('new title')
      })
    })

    describe('restoreOnUnmount', () => {
      it('should be new value if restoreOnUnmount is false', () => {
        const Comp = useSetup(() => {
          const title = useTitle('origin title', { restoreOnUnmount: false })
          title.value = 'new title'
          expect(title.value).toBe('new title')
        })

        Comp.unmount()
        expect(document.title).toBe('new title')
      })

      it('should be restored if title not modified and restoreOnUnmount return null', () => {
        const Comp = useSetup(() => {
          useTitle('origin title', { restoreOnUnmount: () => null })
        })

        Comp.unmount()
        expect(document.title).toBe('origin title')
      })

      it('should be restored if restoreOnUnmount has return value', () => {
        const Comp = useSetup(() => {
          const title = useTitle('origin title', { restoreOnUnmount: () => 'restored title' })
          title.value = 'new title'
          expect(title.value).toBe('new title')
        })

        Comp.unmount()
        expect(document.title).toBe('restored title')
      })
    })
  })
})
