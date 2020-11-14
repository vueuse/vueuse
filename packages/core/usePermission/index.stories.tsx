import { defineDemo, html } from '../../_docs'
import { defineComponent } from 'vue-demi'
import { usePermission } from '.'

defineDemo(
  {
    name: 'usePermission',
    category: 'Browser',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      return {
        geolocation: usePermission('geolocation'),
        microphone: usePermission('microphone'),
        notifications: usePermission('notifications'),
        camera: usePermission('camera'),
        midi: usePermission('midi'),
      }
    },

    template: html`
      <div>
        <pre lang="json">{{
          JSON.stringify({
            geolocation,
            microphone,
            notifications,
            camera,
            midi,
          }, null, 2)
        }}</pre>
      </div>
    `,
  }),
)
