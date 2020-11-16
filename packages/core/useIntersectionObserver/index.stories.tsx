import { defineComponent, ref } from 'vue-demi'
import { useIntersectionObserver } from '.'
import { defineDemo, html } from '../../_docs'

defineDemo(
  {
    name: 'useIntersectionObserver',
    category: 'Sensors',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      const root = ref(null)
      const demo = ref(null)
      const demoIsVisible = ref(false)

      const stopObserver = useIntersectionObserver(
        demo,
        ([{ isIntersecting }], observerElement) => {
          demoIsVisible.value = isIntersecting
        },
        { root },
      )

      return {
        root,
        demo,
        demoIsVisible,
        stopObserver,
      }
    },

    template: html`
      <div id="demo">
        <div
          style="
            border: 2px dashed #ccc;
            max-height: 150px;
            margin: 0 2rem 1rem;
            overflow-y: scroll;
          "
          ref="root"
        >
          <p style="text-align: center">Scroll me!</p>
          <div
            style="
              border: 2px dashed #d78a8a;
              min-height: 200px;
              margin: 10rem 2rem;
              padding: 1rem;
            "
            ref="demo"
          >
            <h1>Hello world</h1>
          </div>
        </div>
        <div class="text-center">
          {{ demoIsVisible ? 'Inside the viewport' : 'Outside the viewport'}}
        </div>
      </div>
    `,
  }),
)
