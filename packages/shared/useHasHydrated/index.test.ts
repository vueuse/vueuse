import type {
  ShallowRef,
} from 'vue'
import { renderToString } from '@vue/server-renderer'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import {
  createSSRApp,
  defineAsyncComponent,
  defineComponent,
  h,
  nextTick,
  onBeforeMount,
  onMounted,
  shallowRef,
  Suspense,
} from 'vue'
import { useHasHydrated } from './index.ts'

describe('useHasHydrated', () => {
  it('should be defined', () => {
    expect(useHasHydrated).toBeDefined()
  })

  it('should throw when not used in a component', () => {
    expect(() => useHasHydrated()).toThrowError('useHasHydrated must be used in a component')
  })

  describe('should compute if hydrated properly', () => {
    it('ensure we have hydration mismatch in test env', async () => {
      const Comp = defineComponent({
        setup() {
          return () => 'hydrated'
        },
      })

      const el = document.createElement('div')
      el.innerHTML = 'dehydrated' // Don't forget to drink some water

      const warnMock = vi.fn()
      const errorMock = vi.fn()
      const warnBackup = console.warn
      const errorBackup = console.error
      try {
        console.warn = warnMock
        console.error = errorMock
        createSSRApp(Comp).mount(el, true)

        await nextTick()
        expect(warnMock).toHaveBeenCalledOnce()
        expect(errorMock).toHaveBeenCalledWith('Hydration completed but contains mismatches.')
      }
      finally {
        console.warn = warnBackup
        console.error = errorBackup
      }
    })

    it('should be false if running SSR hydration and not mounted', async () => {
      let value: ShallowRef<boolean>

      const Comp = defineComponent({
        setup() {
          value = useHasHydrated()
          onBeforeMount(() => {
            expect(value.value).toBe(false)
          })
          onMounted(() => {
            expect(value.value).toBe(true)
          })
          return () => value.value ? 'hydrated' : 'dehydrated'
        },
      })

      const app = createSSRApp(Comp)
      const html = await renderToString(app)

      expect(html).toBe('dehydrated')

      const el = document.createElement('div')
      el.innerHTML = html

      app.mount(el, true)

      await nextTick()

      expect.assertions(3)
    })

    it('should be true when showing after already hydrated', async () => {
      let value: ShallowRef<boolean>
      const show = shallowRef(false)

      const Comp = defineComponent({
        setup() {
          value = useHasHydrated()
          onBeforeMount(() => {
            expect(value.value).toBe(true)
          })
          return () => value.value ? 'hydrated' : 'dehydrated'
        },
      })

      const App = defineComponent({
        setup() {
          return () => show.value ? h(Comp) : 'ssr'
        },
      })

      const app = createSSRApp(App)
      const html = await renderToString(app)

      expect(html).toBe('ssr')

      const el = document.createElement('div')
      el.innerHTML = html

      app.mount(el, true)

      await nextTick()
      show.value = true
      await nextTick()

      expect(el.innerHTML).toBe('hydrated')
      expect.assertions(3)
    })

    it('should handle suspense hydration', async () => {
      const consoleBack = console.info
      try {
        // Ignore Experimental suspense log
        console.info = () => (void 0)
        const show = shallowRef(false)
        const Comp = defineComponent({
          setup() {
            const value = useHasHydrated()
            onBeforeMount(() => {
              expect(value.value).toBe(false)
            })
            onMounted(() => {
              expect(value.value).toBe(true)
            })
            return () => h('span', value.value ? 'hydrated' : 'dehydrated')
          },
        })
        const IfComp = defineComponent({
          setup() {
            const value = useHasHydrated()
            onBeforeMount(() => {
              expect(value.value).toBe(true)
            })
            return () => h('span', value.value ? 'hydrated' : 'dehydrated')
          },
        })
        const AsyncComponent = defineAsyncComponent({
          loader: () => Promise.resolve(Comp),
        })
        const IfAsync = defineAsyncComponent({
          loader: () => Promise.resolve(defineComponent({
            setup() {
              return () => show.value ? h(IfComp) : h('span', 'fallback')
            },
          })),
        })
        const App = defineComponent({
          setup() {
            return () => h(Suspense, h('div', [
              h(AsyncComponent),
              h(Comp),
              h(IfAsync),
              show.value ? h(IfAsync) : null,
              show.value ? h(IfComp) : null,
            ]))
          },
        })

        const html = await renderToString(createSSRApp(App))

        const app = createSSRApp(App)
        expect(html).toBe('<div><span>dehydrated</span><span>dehydrated</span><span>fallback</span><!----><!----></div>')

        const el = document.createElement('div')
        el.innerHTML = html

        app.mount(el, true)

        await nextTick()
        show.value = true
        await nextTick()
        expect(el.innerHTML).toBe('<div><span>hydrated</span><span>hydrated</span><span>hydrated</span><span>hydrated</span><span>hydrated</span></div>')
      }
      finally {
        console.info = consoleBack
      }
    })

    it('should be true if not running SSR hydration', () => {
      let result: ShallowRef<boolean>

      const TestComponent = defineComponent({
        setup() {
          result = useHasHydrated()

          expect(result.value).toBe(true)
          onBeforeMount(() => {
            expect(result.value).toBe(true)
          })
          onMounted(() => {
            expect(result.value).toBe(true)
          })
          return () => null
        },
      })

      mount(TestComponent)

      expect.assertions(3)
    })
  })
})
