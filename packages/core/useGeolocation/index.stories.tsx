import { defineDemo, html } from '../../_docs'
import { defineComponent } from 'vue-demi'
import { useGeolocation } from '.'

defineDemo(
  {
    name: 'useGeolocation',
    category: 'Sensors',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      return useGeolocation()
    },

    template: html`
      <div>
        <pre lang="json">{{JSON.stringify({
            coords: {
              accuracy: coords.accuracy,
              latitude: coords.latitude,
              longitude: coords.longitude,
              altitude: coords.altitude,
              altitudeAccuracy: coords.altitudeAccuracy,
              heading: coords.heading,
              speed: coords.speed,
            },
            locatedAt,
            error: error ? error.message : error,
          }, null, 2)}}
        </pre>
      </div>
    `,
  }),
)
