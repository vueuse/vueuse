import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { defineComponent, ref, watch, onMounted } from '../../api'
import { useMouse, useEventListener, useRafFn } from '../../core'

// ported from https://codepen.io/Mamboleoo/pen/obWGYr

const colors = ['#34495E', '#3D6962', '#468966', '#A3BD86', '#FFF0A5']

function Particle(x, y, ww, wh) {
  this.x = Math.random() * ww
  this.y = Math.random() * wh
  this.dest = {
    x,
    y,
  }
  this.r = Math.random() * 3 + 2
  this.vx = (Math.random() - 0.5) * 20
  this.vy = (Math.random() - 0.5) * 20
  this.accX = 0
  this.accY = 0
  this.friction = Math.random() * 0.05 + 0.94
  this.color = colors[Math.floor(Math.random() * 6)]
}

Particle.prototype.render = function(ctx, x, y, radius) {
  this.accX = (this.dest.x - this.x) / 1000
  this.accY = (this.dest.y - this.y) / 1000
  this.vx += this.accX
  this.vy += this.accY
  this.vx *= this.friction
  this.vy *= this.friction

  this.x += this.vx
  this.y += this.vy

  ctx.fillStyle = this.color
  ctx.beginPath()
  ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false)
  ctx.fill()

  const a = this.x - x
  const b = this.y - y

  const distance = Math.sqrt(a * a + b * b)
  if (distance < (radius * 70)) {
    this.accX = (this.x - x) / 100
    this.accY = (this.y - y) / 100
    this.vx += this.accX
    this.vy += this.accY
  }
}

const Demo = defineComponent({
  setup() {
    const canvasRef = ref<HTMLCanvasElement | null>(null)
    const text = ref('VUEUSE')
    const { x: mouseX, y: mouseY } = useMouse({
      resetOnTouchEnds: true,
      initial: { x: -9999, y: -9999 },
    })
    let particles = []
    let amount = 0
    let radius = 1

    let canvas: HTMLCanvasElement
    let ctx: CanvasRenderingContext2D

    let ww = 0
    let wh = 0

    function initScene() {
      ww = canvas.width = window.innerWidth
      wh = canvas.height = window.innerHeight

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const fontSize = Math.min(ww / 4, 300)

      ctx.font = `bold ${fontSize}px sans-serif`
      ctx.textAlign = 'center'
      ctx.fillText(text.value, ww / 2, wh / 2 + fontSize / 4)

      const data = ctx.getImageData(0, 0, ww, wh).data
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.globalCompositeOperation = 'screen'

      particles = []
      for (let i = 0; i < ww; i += Math.round(ww / 150)) {
        for (let j = 0; j < wh; j += Math.round(ww / 150)) {
          if (data[((i + j * ww) * 4) + 3] > 150)
            particles.push(new Particle(i, j, ww, wh))
        }
      }
      amount = particles.length
    }

    watch(() => text, initScene, { lazy: true })
    useEventListener('resize', initScene)
    useEventListener('click', () => {
      radius++
      if (radius === 5)
        radius = 0
    })

    const { start } = useRafFn(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (let i = 0; i < amount; i++)
        particles[i].render(ctx, mouseX.value, mouseY.value, radius)
    }, { startNow: false })

    onMounted(() => {
      canvas = canvasRef.value as HTMLCanvasElement
      ctx = canvas.getContext('2d')
      ww = canvas.width = window.innerWidth
      wh = canvas.height = window.innerHeight

      initScene()
      start()
    })

    return {
      canvas: canvasRef,
    }
  },

  render(this: Vue) {
    return (
      <div id="showcase">
        <canvas ref='canvas'></canvas>
        <div id="info">
          <p id="title">Text Particales</p>
          <p id="meta">
            <a href='https://codepen.io/Mamboleoo/pen/obWGYr' target='__blank'>Credit</a>
            <span>|</span>
            <a href='https://github.com/antfu/vue-use-utils/blob/master/src/showcases/text_particles.stories.tsx' target='__blank'>Source</a>
          </p>
        </div>
      </div>
    )
  },
})

storiesOf('ShowCases', module)
  .add('Text Particles', () => Demo as any)
