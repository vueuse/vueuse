import YAML from 'js-yaml'
import { defineDemo, html } from '../../_docs'
import { CSSProperties } from 'react'
import { defineComponent, ref } from 'vue-demi'
import { useParallax } from '.'
import { useMediaQuery } from '../useMediaQuery'

const demo: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  minHeight: '500px',
  transition: '.3s ease-out all',
}
const container: CSSProperties = {
  margin: '3em auto',
  perspective: '300px',
}
const card: CSSProperties = {
  background: '#fff',
  height: '20rem',
  width: '15rem',
  borderRadius: '5px',
  overflow: 'hidden',
  transition: '.3s ease-out all',
  boxShadow: '0 0 20px 0 rgba(255, 255, 255, 0.25)',
}
const card__window: CSSProperties = {
  overflow: 'hidden',
  fontSize: '6rem',
  position: 'absolute',
  top: 'calc(50% - 1em)',
  left: 'calc(50% - 1em)',
  height: '2em',
  width: '2em',
  margin: 'auto',
}
const img: CSSProperties = {
  position: 'absolute',
  height: '100%',
  width: '100%',
  transition: '.3s ease-out all',
}
const info: CSSProperties = {
  opacity: 0.4,
  top: '60px',
  left: '60px',
}

defineDemo(
  {
    name: 'useParallax',
    category: 'Sensors',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      const target = ref(null)

      return {
        ...useParallax({
          deviceOrientationTiltAdjust: i => i * 2,
          deviceOrientationRollAdjust: i => i * 2,
          targetElement: target,
        }),
        isMobile: useMediaQuery('(max-width: 700px)'),
        card__window,
        container,
        target,
        YAML,
        demo,
        info,
        card,
        img,
      }
    },

    template: html`
      <div>
        <div ref="demo" :style="demo">
          <pre :style="{ ...info, position: isMobile ? 'inherit' : 'absolute' }">{{
            YAML.safeDump({
              tilt,
              roll,
              source,
            })
          }}</pre>
          <div :style="container">
            <div :style="{ ...card, transform: 'rotateX(' + (roll * 20) + 'deg) rotateY(' + (tilt * 20) + 'deg)' }">
              <div :style="card__window">
                <img
                  :style="{ ...img, transform: 'translateX(' + (tilt * 10) + 'px) translateY(' + (roll * 10) + 'px) scale(1.33)' }"
                  src="http://jaromvogel.com/images/design/jumping_rabbit/page2layer0.png" alt=""
                />
                <img
                  :style="{ ...img, transform: 'translateX(' + (tilt * 20) + 'px) translateY(' + (roll * 20) + 'px) scale(1.33)' }"
                  src="http://jaromvogel.com/images/design/jumping_rabbit/page2layer1.png" alt=""
                />
                <img
                  :style="{ ...img, transform: 'translateX(' + (tilt * 30) + 'px) translateY(' + (roll * 30) + 'px) scale(1.33)' }"
                  src="http://jaromvogel.com/images/design/jumping_rabbit/page2layer2.png" alt=""
                />
                <img
                  :style="{ ...img, transform: 'translateX(' + (tilt * 40) + 'px) translateY(' + (roll * 40) + 'px) scale(1.33)' }"
                  src="http://jaromvogel.com/images/design/jumping_rabbit/page2layer3.png" alt=""
                />
                <img
                  :style="img" src="http://jaromvogel.com/images/design/jumping_rabbit/page2layer4.png" alt=""
                />
              </div>
            </div>
          </div>
          <note style="opacity: 1;">Credits of image to <a href="https://codepen.io/jaromvogel" target="__blank">Jarom Vogel</a></note>
        </div>
      </div>
    `,
  }),
)
