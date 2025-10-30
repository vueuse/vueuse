import { mount } from '@vue/test-utils'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { computed, defineComponent, nextTick, onMounted, shallowRef, useTemplateRef } from 'vue'
import { useIntersectionObserver } from '.'

describe('useIntersectionObserver', () => {
  describe('send correct IntersectionObserver messages', () => {
    const IntersectionObserverMock = vi.fn(() => ({
      disconnect: vi.fn(),
      observe: vi.fn(),
      unobserve: vi.fn(),
      takeRecords: vi.fn(),
    }))

    beforeAll(() => {
      vi.stubGlobal('IntersectionObserver', IntersectionObserverMock)
    })

    afterEach(() => {
      vi.clearAllMocks()
    })

    afterAll(() => {
      vi.unstubAllGlobals()
    })

    it('should IntersectionObserver with the default parameters', async () => {
      const target = shallowRef(document.createElement('div'))
      const callback = vi.fn()

      useIntersectionObserver(target, callback)

      await nextTick()

      expect(IntersectionObserverMock).toHaveBeenCalledTimes(1)
      expect(IntersectionObserverMock).toHaveBeenCalledWith(callback, {
        root: undefined,
        rootMargin: '0px',
        threshold: 0,
      })
      const observer = IntersectionObserverMock.mock.results[0].value
      expect(observer.observe).toHaveBeenCalledWith(target.value)
    })

    it('should pass options to IntersectionObserver', async () => {
      const target = shallowRef(document.createElement('div'))
      const root = shallowRef(document.createElement('div'))
      const callback = vi.fn()

      useIntersectionObserver(target, callback, {
        root,
        rootMargin: '10px 20px 30px 40px',
        threshold: [0, 0.5, 1],
      })

      await nextTick()

      expect(IntersectionObserverMock).toHaveBeenCalledTimes(1)
      expect(IntersectionObserverMock).toHaveBeenCalledWith(callback, {
        root: root.value,
        rootMargin: '10px 20px 30px 40px',
        threshold: [0, 0.5, 1],
      })
    })

    it('should observe each target when the target is an array of elements', async () => {
      const target1 = document.createElement('div')
      const target2 = document.createElement('div')
      const callback = vi.fn()

      useIntersectionObserver([target1, target2], callback)

      await nextTick()

      expect(IntersectionObserverMock).toHaveBeenCalledTimes(1)
      const observer = IntersectionObserverMock.mock.results[0].value
      expect(observer.observe).toHaveBeenCalledTimes(2)
      expect(observer.observe).toHaveBeenCalledWith(target1)
      expect(observer.observe).toHaveBeenCalledWith(target2)
    })

    describe('when using in a component', () => {
      const ChildComponent = defineComponent({
        template: '<div id="child-component" />',
      })
      const component = defineComponent({
        template: `
          <div>
            <div ref="template-ref-el" id="template-ref-el" />
            <ChildComponent ref="child-component-ref" />
            <div id="target-node-1" />
            <div id="target-node-2" />
          </div>
        `,
        components: {
          ChildComponent,
        },
        setup() {
          const templateRefEl = useTemplateRef<HTMLElement>('template-ref-el')
          const childComponentRef = useTemplateRef<HTMLElement>('child-component-ref')
          const computedTarget = computed(() => document.getElementById('target-node-2'))

          onMounted(() => {
            useIntersectionObserver(
              [templateRefEl, childComponentRef, document.getElementById('target-node-1'), computedTarget],
              () => {},
            )
          })
        },
      })

      beforeEach(() => {
        document.body.innerHTML = '<div id="app"></div>'
      })

      afterEach(() => {
        document.body.innerHTML = ''
      })

      it('should get the targets elements and observe them', async () => {
        mount(component, { attachTo: '#app' })

        await nextTick()

        expect(IntersectionObserverMock).toHaveBeenCalledTimes(1)
        const observer = IntersectionObserverMock.mock.results[0].value

        expect(observer.observe).toHaveBeenCalledTimes(4)
        expect(observer.observe.mock.calls[0][0]).toHaveProperty('id', 'template-ref-el')
        expect(observer.observe.mock.calls[1][0]).toHaveProperty('id', 'child-component')
        expect(observer.observe.mock.calls[2][0]).toHaveProperty('id', 'target-node-1')
        expect(observer.observe.mock.calls[3][0]).toHaveProperty('id', 'target-node-2')
      })

      it('should disconnect IntersectionObserver on unmount', async () => {
        const wrapper = mount(component, { attachTo: '#app' })
        await nextTick()

        expect(IntersectionObserverMock).toHaveBeenCalledTimes(1)
        const observer = IntersectionObserverMock.mock.results[0].value

        wrapper.unmount()
        await nextTick()

        expect(observer.disconnect).toHaveBeenCalledTimes(1)
      })
    })
  })
})
