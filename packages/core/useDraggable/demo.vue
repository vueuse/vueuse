<script setup lang="ts">
import { UseDraggable as Draggable } from '@vueuse/components'
import { useDraggable } from '@vueuse/core'
import { shallowRef, useTemplateRef } from 'vue'

type Mode = 'main' | 'autoscroll' | 'snap'
const mode = shallowRef<Mode>('main')
const disabled = shallowRef(false)

// ── MAIN ──────────────────────────────────────────────────────────────────────
// 1. Basic
const cMain1 = useTemplateRef<HTMLElement>('cMain1')
const dMain1 = useTemplateRef<HTMLElement>('dMain1')
const { x: xM1, y: yM1, style: sM1 } = useDraggable(dMain1, {
  containerElement: cMain1,
  initialValue: { x: 10, y: 10 },
  preventDefault: true,
  disabled,
})

// 2. Custom handle
const cMain2 = useTemplateRef<HTMLElement>('cMain2')
const dMain2 = useTemplateRef<HTMLElement>('dMain2')
const hMain2 = useTemplateRef<HTMLElement>('hMain2')
const { x: xM2, y: yM2, style: sM2 } = useDraggable(dMain2, {
  containerElement: cMain2,
  initialValue: { x: 10, y: 10 },
  handle: hMain2,
  preventDefault: true,
  disabled,
})

// 3. Persisted (renderless component, defined in template)
const cMain3 = useTemplateRef<HTMLElement>('cMain3')

// 4. Axis lock
const cMain5 = useTemplateRef<HTMLElement>('cMain5')
const dMain5a = useTemplateRef<HTMLElement>('dMain5a')
const dMain5b = useTemplateRef<HTMLElement>('dMain5b')
const { x: xM5a, y: yM5a, style: sM5a } = useDraggable(dMain5a, {
  containerElement: cMain5,
  initialValue: { x: 10, y: 10 },
  axis: 'x',
  preventDefault: true,
  disabled,
})
const { x: xM5b, y: yM5b, style: sM5b } = useDraggable(dMain5b, {
  containerElement: cMain5,
  initialValue: { x: 220, y: 10 },
  axis: 'y',
  preventDefault: true,
  disabled,
})

// ── AUTO SCROLL ───────────────────────────────────────────────────────────────
// 1. Default: both axes, default speed/margin
const cAS1 = useTemplateRef<HTMLElement>('cAS1')
const dAS1 = useTemplateRef<HTMLElement>('dAS1')
const { x: xA1, y: yA1, style: sA1 } = useDraggable(dAS1, {
  containerElement: cAS1,
  initialValue: { x: 10, y: 10 },
  autoScroll: true,
  preventDefault: true,
})

// 2. Custom speed and margin
const cAS2 = useTemplateRef<HTMLElement>('cAS2')
const dAS2 = useTemplateRef<HTMLElement>('dAS2')
const { x: xA2, y: yA2, style: sA2 } = useDraggable(dAS2, {
  containerElement: cAS2,
  initialValue: { x: 10, y: 10 },
  autoScroll: { speed: 6, margin: 60 },
  preventDefault: true,
})

// 3. Direction-locked: x-only and y-only side by side
const cAS3 = useTemplateRef<HTMLElement>('cAS3')
const dAS3 = useTemplateRef<HTMLElement>('dAS3')
const { x: xA3, y: yA3, style: sA3 } = useDraggable(dAS3, {
  containerElement: cAS3,
  initialValue: { x: 10, y: 10 },
  autoScroll: { direction: 'x' },
  preventDefault: true,
})
const cAS4 = useTemplateRef<HTMLElement>('cAS4')
const dAS4 = useTemplateRef<HTMLElement>('dAS4')
const { x: xA4, y: yA4, style: sA4 } = useDraggable(dAS4, {
  containerElement: cAS4,
  initialValue: { x: 10, y: 10 },
  autoScroll: { direction: 'y' },
  preventDefault: true,
})

// 4. Tiered speed via sensitivity
const cAS5 = useTemplateRef<HTMLElement>('cAS5')
const dAS5 = useTemplateRef<HTMLElement>('dAS5')
const { x: xA5, y: yA5, style: sA5 } = useDraggable(dAS5, {
  containerElement: cAS5,
  initialValue: { x: 10, y: 10 },
  autoScroll: { speed: [1, 5, 14], sensitivity: [70, 35, 12] },
  preventDefault: true,
})

// 5. Scroll bounds: restrict how far auto-scroll can go
const cAS6 = useTemplateRef<HTMLElement>('cAS6')
const dAS6 = useTemplateRef<HTMLElement>('dAS6')
const { x: xA6, y: yA6, style: sA6 } = useDraggable(dAS6, {
  containerElement: cAS6,
  initialValue: { x: 10, y: 10 },
  autoScroll: { speed: 6, maxX: 400, maxY: 200 },
  preventDefault: true,
})

// ── SNAP ──────────────────────────────────────────────────────────────────────
// 1. Point: absolute px vs percentage
const cPoint = useTemplateRef<HTMLElement>('cPoint')
const dP1 = useTemplateRef<HTMLElement>('dP1')
const dP2 = useTemplateRef<HTMLElement>('dP2')
const { x: xP1, y: yP1, style: sP1, snapped: snP1 } = useDraggable(dP1, { containerElement: cPoint, initialValue: { x: 10, y: 10 }, snap: 60 })
const { x: xP2, y: yP2, style: sP2, snapped: snP2 } = useDraggable(dP2, { containerElement: cPoint, initialValue: { x: 220, y: 10 }, snap: '50%' })

// 2. Lines: vertical vs horizontal
const cLine = useTemplateRef<HTMLElement>('cLine')
const dL1 = useTemplateRef<HTMLElement>('dL1')
const dL2 = useTemplateRef<HTMLElement>('dL2')
const { x: xL1, y: yL1, style: sL1, snapped: snL1 } = useDraggable(dL1, { containerElement: cLine, initialValue: { x: 10, y: 10 }, snap: { x: '40%' } })
const { x: xL2, y: yL2, style: sL2, snapped: snL2 } = useDraggable(dL2, { containerElement: cLine, initialValue: { x: 220, y: 10 }, snap: { y: '50%' } })

// 3. Grid: uniform step vs per-axis step (separate containers so each grid is unambiguous)
const cGrid1 = useTemplateRef<HTMLElement>('cGrid1')
const cGrid2 = useTemplateRef<HTMLElement>('cGrid2')
const dG1 = useTemplateRef<HTMLElement>('dG1')
const dG2 = useTemplateRef<HTMLElement>('dG2')
const { x: xG1, y: yG1, style: sG1, snapped: snG1 } = useDraggable(dG1, { containerElement: cGrid1, initialValue: { x: 10, y: 10 }, snap: { step: 40 } })
const { x: xG2, y: yG2, style: sG2, snapped: snG2 } = useDraggable(dG2, { containerElement: cGrid2, initialValue: { x: 10, y: 10 }, snap: { x: { step: '20%' }, y: { step: '25%' } } })

// 4. Corner options: tl vs tr vs all
const cCorner = useTemplateRef<HTMLElement>('cCorner')
const dC1 = useTemplateRef<HTMLElement>('dC1')
const dC2 = useTemplateRef<HTMLElement>('dC2')
const dC3 = useTemplateRef<HTMLElement>('dC3')
const { x: xC1, y: yC1, style: sC1, snapped: snC1 } = useDraggable(dC1, { containerElement: cCorner, initialValue: { x: 10, y: 10 }, snap: { x: '50%', y: '50%', corner: 'tl' } })
const { x: xC2, y: yC2, style: sC2, snapped: snC2 } = useDraggable(dC2, { containerElement: cCorner, initialValue: { x: 220, y: 10 }, snap: { x: '50%', y: '50%', corner: 'tr' } })
const { x: xC3, y: yC3, style: sC3, snapped: snC3 } = useDraggable(dC3, { containerElement: cCorner, initialValue: { x: 10, y: 170 }, snap: { x: '50%', y: '50%', corner: 'all' } })

// 5. Side options + range-restricted line: start vs end on a half-height vertical line
const cSide = useTemplateRef<HTMLElement>('cSide')
const dS1 = useTemplateRef<HTMLElement>('dS1')
const dS2 = useTemplateRef<HTMLElement>('dS2')
const { x: xS1, y: yS1, style: sS1, snapped: snS1 } = useDraggable(dS1, { containerElement: cSide, initialValue: { x: 10, y: 10 }, snap: { x: '50%', y: { end: '50%' }, side: 'start' } })
const { x: xS2, y: yS2, style: sS2, snapped: snS2 } = useDraggable(dS2, { containerElement: cSide, initialValue: { x: 220, y: 10 }, snap: { x: '50%', y: { end: '50%' }, side: 'end' } })

// 6. Bounding box: inside vs outside
const cBox = useTemplateRef<HTMLElement>('cBox')
const dB1 = useTemplateRef<HTMLElement>('dB1')
const dB2 = useTemplateRef<HTMLElement>('dB2')
const boxRect = { left: '25%', top: '25%', right: '75%', bottom: '75%' }
const { x: xB1, y: yB1, style: sB1, snapped: snB1 } = useDraggable(dB1, { containerElement: cBox, initialValue: { x: 200, y: 130 }, snap: { boundingBox: boxRect, edge: 'inside', gravity: 30 } })
const { x: xB2, y: yB2, style: sB2, snapped: snB2 } = useDraggable(dB2, { containerElement: cBox, initialValue: { x: 10, y: 230 }, snap: { boundingBox: boxRect, edge: 'outside', gravity: 30 } })

// 7. Multiple targets + per-target gravity + center
const cMulti = useTemplateRef<HTMLElement>('cMulti')
const dM = useTemplateRef<HTMLElement>('dM')
const { x: xM, y: yM, style: sM, snapped: snM } = useDraggable(dM, {
  containerElement: cMulti,
  initialValue: { x: 10, y: 10 },
  snap: { targets: [{ x: '25%', gravity: 15 }, { x: '50%', gravity: 60 }, { x: '75%' }], gravity: 30, center: true },
})
</script>

<template>
  <div>
    <!-- Mode selector (styled to match useFuse demo's filter dropdown) -->
    <div mb-4 flex flex-wrap items-center gap-3>
      <div bg="dark:(dark-300) light-700" border="1 light-900 dark:(dark-700)" rounded relative flex items-center>
        <select v-model="mode" pl-2 pr-8 py-1 bg-transparent text-left appearance-none>
          <option bg="dark:(dark-300) light-700" value="main">
            Main
          </option>
          <option bg="dark:(dark-300) light-700" value="autoscroll">
            Auto Scroll
          </option>
          <option bg="dark:(dark-300) light-700" value="snap">
            Snap
          </option>
        </select>
        <i i-carbon-chevron-down absolute right-2 pointer-events-none opacity-70 />
      </div>
      <label v-if="mode === 'main'" class="checkbox">
        <input v-model="disabled" type="checkbox">
        <span>Disabled drag and drop</span>
      </label>
    </div>

    <!-- ── MAIN ─────────────────────────────────────────────────────── -->
    <div v-if="mode === 'main'" class="flex flex-col gap-6">
      <!-- 1. Basic -->
      <div>
        <div class="snap-title">
          1. Basic — drag the card freely within the container
        </div>
        <div ref="cMain1" class="snap-container">
          <div ref="dMain1" class="snap-card" :style="sM1">
            <div class="snap-label">
              👋 Drag me!
            </div>
            <div class="snap-coords">
              {{ Math.round(xM1) }}, {{ Math.round(yM1) }}
            </div>
          </div>
        </div>
      </div>

      <!-- 2. Custom handle -->
      <div>
        <div class="snap-title">
          2. Custom <code>handle</code> — only the labelled handle starts a drag; the rest of the card is not draggable
        </div>
        <div ref="cMain2" class="snap-container">
          <div ref="dMain2" class="snap-card" style="cursor:default; padding:0" :style="sM2">
            <div ref="hMain2" class="snap-label" style="cursor:move; padding:6px 12px; border-bottom:1px solid var(--vp-c-divider)">
              ☰ drag handle
            </div>
            <div class="snap-coords" style="padding:6px 12px">
              body is not draggable
            </div>
            <div class="snap-coords" style="padding:0 12px 6px">
              {{ Math.round(xM2) }}, {{ Math.round(yM2) }}
            </div>
          </div>
        </div>
      </div>

      <!-- 3. Persisted via renderless component + sessionStorage -->
      <div>
        <div class="snap-title">
          3. Persisted position — renderless <code>&lt;UseDraggable&gt;</code> with <code>storage-key</code> + <code>storage-type:'session'</code>
        </div>
        <div ref="cMain3" class="snap-container">
          <Draggable
            v-slot="{ x, y }"
            class="snap-card"
            :container-element="cMain3"
            :initial-value="{ x: 10, y: 10 }"
            prevent-default
            storage-key="vueuse-draggable-pos"
            storage-type="session"
            :disabled="disabled"
          >
            <div class="snap-label">
              💾 persisted
            </div>
            <div class="snap-coords">
              {{ Math.round(x) }}, {{ Math.round(y) }} · sessionStorage
            </div>
          </Draggable>
        </div>
      </div>

      <!-- 4. Axis lock -->
      <div>
        <div class="snap-title">
          4. Axis lock — <code>axis:'x'</code> (horizontal only) and <code>axis:'y'</code> (vertical only)
        </div>
        <div ref="cMain5" class="snap-container">
          <div ref="dMain5a" class="snap-card" :style="sM5a">
            <div class="snap-label">
              ↔ axis:x
            </div>
            <div class="snap-coords">
              {{ Math.round(xM5a) }}, {{ Math.round(yM5a) }}
            </div>
          </div>
          <div ref="dMain5b" class="snap-card" :style="sM5b">
            <div class="snap-label">
              ↕ axis:y
            </div>
            <div class="snap-coords">
              {{ Math.round(xM5b) }}, {{ Math.round(yM5b) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── AUTO SCROLL ──────────────────────────────────────────────── -->
    <div v-else-if="mode === 'autoscroll'" class="flex flex-col gap-6">
      <p class="italic op50 text-xs">
        Drag a card toward an edge of its scrollable container to make it auto-scroll. Each container holds a 1200×500px scroll surface.
      </p>

      <!-- 1. Default both axes -->
      <div>
        <div class="snap-title">
          1. Default — <code>autoScroll:true</code> (both axes, speed 2, margin 30)
        </div>
        <div ref="cAS1" class="snap-container scroll-container">
          <div class="scroll-surface" />
          <div ref="dAS1" class="snap-card" :style="sA1">
            <div class="snap-label">
              ▦ both axes
            </div>
            <div class="snap-coords">
              {{ Math.round(xA1) }}, {{ Math.round(yA1) }}
            </div>
          </div>
        </div>
      </div>

      <!-- 2. Custom speed and margin -->
      <div>
        <div class="snap-title">
          2. Custom <code>speed</code> + <code>margin</code> — <code>{ speed: 6, margin: 60 }</code> (3× faster, 2× wider trigger zone shown shaded)
        </div>
        <div ref="cAS2" class="snap-container scroll-container">
          <div class="scroll-surface" />
          <div ref="dAS2" class="snap-card" :style="sA2">
            <div class="snap-label">
              ⚡ fast / wide trigger
            </div>
            <div class="snap-coords">
              {{ Math.round(xA2) }}, {{ Math.round(yA2) }}
            </div>
          </div>
        </div>
      </div>

      <!-- 3. Direction-locked: x-only and y-only side by side -->
      <div>
        <div class="snap-title">
          3. Direction-locked — <code>direction:'x'</code> (horizontal only) and <code>direction:'y'</code> (vertical only)
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div ref="cAS3" class="snap-container scroll-container">
            <div class="scroll-surface" />
            <div ref="dAS3" class="snap-card" :style="sA3">
              <div class="snap-label">
                ↔ x-only
              </div>
              <div class="snap-coords">
                {{ Math.round(xA3) }}, {{ Math.round(yA3) }}
              </div>
            </div>
          </div>
          <div ref="cAS4" class="snap-container scroll-container">
            <div class="scroll-surface" />
            <div ref="dAS4" class="snap-card" :style="sA4">
              <div class="snap-label">
                ↕ y-only
              </div>
              <div class="snap-coords">
                {{ Math.round(xA4) }}, {{ Math.round(yA4) }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 4. Tiered speed / sensitivity -->
      <div>
        <div class="snap-title">
          4. Tiered acceleration — <code>{ speed: [1, 5, 14], sensitivity: [70, 35, 12] }</code> (scroll accelerates the closer the card gets to the edge)
        </div>
        <div ref="cAS5" class="snap-container scroll-container">
          <div class="scroll-surface" />
          <div ref="dAS5" class="snap-card" :style="sA5">
            <div class="snap-label">
              🚀 tiered speed
            </div>
            <div class="snap-coords">
              {{ Math.round(xA5) }}, {{ Math.round(yA5) }}
            </div>
          </div>
        </div>
      </div>

      <!-- 5. Scroll bounds -->
      <div>
        <div class="snap-title">
          5. Scroll bounds — <code>{ speed: 6, maxX: 400, maxY: 200 }</code> (auto-scroll stops at x=400, y=200 regardless of container size)
        </div>
        <div ref="cAS6" class="snap-container scroll-container">
          <div class="scroll-surface" />
          <div ref="dAS6" class="snap-card" :style="sA6">
            <div class="snap-label">
              🛑 bounded
            </div>
            <div class="snap-coords">
              {{ Math.round(xA6) }}, {{ Math.round(yA6) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── SNAP ─────────────────────────────────────────────────────── -->
    <div v-else-if="mode === 'snap'" class="flex flex-col gap-6">
      <!-- 1. Point snapping -->
      <div>
        <div class="snap-title">
          1. Point snapping — <code>snap:60</code> (absolute px) and <code>snap:'50%'</code> (relative)
        </div>
        <div ref="cPoint" class="snap-container">
          <div class="snap-dot" style="left:60px;top:60px" />
          <div class="snap-dot" style="left:50%;top:50%" />
          <div ref="dP1" class="snap-card" :class="{ snapped: snP1 }" :style="sP1">
            <div class="snap-label">
              {{ snP1 ? '● snap:60' : '○ snap:60' }}
            </div>
            <div class="snap-coords">
              {{ Math.round(xP1) }}, {{ Math.round(yP1) }}
            </div>
          </div>
          <div ref="dP2" class="snap-card" :class="{ snapped: snP2 }" :style="sP2">
            <div class="snap-label">
              {{ snP2 ? "● snap:'50%'" : "○ snap:'50%'" }}
            </div>
            <div class="snap-coords">
              {{ Math.round(xP2) }}, {{ Math.round(yP2) }}
            </div>
          </div>
        </div>
      </div>

      <!-- 2. Line snapping -->
      <div>
        <div class="snap-title">
          2. Line snapping — <code>{x:'40%'}</code> (vertical line) and <code>{y:'50%'}</code> (horizontal line)
        </div>
        <div ref="cLine" class="snap-container">
          <div class="snap-line-v" style="left:40%" />
          <div class="snap-line-h" style="top:50%" />
          <div ref="dL1" class="snap-card" :class="{ snapped: snL1 }" :style="sL1">
            <div class="snap-label">
              {{ snL1 ? '● x:40%' : '○ x:40%' }}
            </div>
            <div class="snap-coords">
              {{ Math.round(xL1) }}, {{ Math.round(yL1) }}
            </div>
          </div>
          <div ref="dL2" class="snap-card" :class="{ snapped: snL2 }" :style="sL2">
            <div class="snap-label">
              {{ snL2 ? '● y:50%' : '○ y:50%' }}
            </div>
            <div class="snap-coords">
              {{ Math.round(xL2) }}, {{ Math.round(yL2) }}
            </div>
          </div>
        </div>
      </div>

      <!-- 3. Grid snapping -->
      <div>
        <div class="snap-title">
          3. Grid snapping — <code>{step:40}</code> (uniform 40px) and <code>{x:{step:'20%'},y:{step:'25%'}}</code> (per-axis)
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div ref="cGrid1" class="snap-container">
            <div v-for="n in 12" :key="`gv${n}`" class="snap-line-v" :style="{ left: `${n * 40}px`, opacity: '0.25' }" />
            <div v-for="n in 5" :key="`gh${n}`" class="snap-line-h" :style="{ top: `${n * 40}px`, opacity: '0.25' }" />
            <div ref="dG1" class="snap-card" :class="{ snapped: snG1 }" :style="sG1">
              <div class="snap-label">
                {{ snG1 ? '● step:40' : '○ step:40' }}
              </div>
              <div class="snap-coords">
                {{ Math.round(xG1) }}, {{ Math.round(yG1) }}
              </div>
            </div>
          </div>
          <div ref="cGrid2" class="snap-container">
            <div v-for="n in 4" :key="`gv2${n}`" class="snap-line-v" :style="{ left: `${n * 20}%`, opacity: '0.25' }" />
            <div v-for="n in 3" :key="`gh2${n}`" class="snap-line-h" :style="{ top: `${n * 25}%`, opacity: '0.25' }" />
            <div ref="dG2" class="snap-card" :class="{ snapped: snG2 }" :style="sG2">
              <div class="snap-label">
                {{ snG2 ? '● x:20% y:25%' : '○ x:20% y:25%' }}
              </div>
              <div class="snap-coords">
                {{ Math.round(xG2) }}, {{ Math.round(yG2) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 4. Corner options -->
      <div>
        <div class="snap-title">
          4. Corner options — which corner snaps to the target point at (50%, 50%): <code>tl</code>, <code>tr</code>, or <code>all</code> (nearest)
        </div>
        <div ref="cCorner" class="snap-container">
          <div class="snap-dot" style="left:50%;top:50%" />
          <div ref="dC1" class="snap-card" :class="{ snapped: snC1 }" :style="sC1">
            <div class="snap-label">
              {{ snC1 ? '● corner:tl' : '○ corner:tl' }}
            </div>
            <div class="snap-coords">
              {{ Math.round(xC1) }}, {{ Math.round(yC1) }}
            </div>
          </div>
          <div ref="dC2" class="snap-card" :class="{ snapped: snC2 }" :style="sC2">
            <div class="snap-label">
              {{ snC2 ? '● corner:tr' : '○ corner:tr' }}
            </div>
            <div class="snap-coords">
              {{ Math.round(xC2) }}, {{ Math.round(yC2) }}
            </div>
          </div>
          <div ref="dC3" class="snap-card" :class="{ snapped: snC3 }" :style="sC3">
            <div class="snap-label">
              {{ snC3 ? '● corner:all' : '○ corner:all' }}
            </div>
            <div class="snap-coords">
              {{ Math.round(xC3) }}, {{ Math.round(yC3) }}
            </div>
          </div>
        </div>
      </div>

      <!-- 5. Side options on a partial line -->
      <div>
        <div class="snap-title">
          5. Side options + partial line — vertical line at x:50% restricted with <code>y:{end:'50%'}</code> so it only snaps in the top half; <code>side:'start'</code> (left edge) vs <code>side:'end'</code> (right edge)
        </div>
        <div ref="cSide" class="snap-container">
          <div class="snap-line-v" style="left:50%; bottom:auto; height:50%" />
          <div ref="dS1" class="snap-card" :class="{ snapped: snS1 }" :style="sS1">
            <div class="snap-label">
              {{ snS1 ? '● side:start' : '○ side:start' }}
            </div>
            <div class="snap-coords">
              {{ Math.round(xS1) }}, {{ Math.round(yS1) }}
            </div>
          </div>
          <div ref="dS2" class="snap-card" :class="{ snapped: snS2 }" :style="sS2">
            <div class="snap-label">
              {{ snS2 ? '● side:end' : '○ side:end' }}
            </div>
            <div class="snap-coords">
              {{ Math.round(xS2) }}, {{ Math.round(yS2) }}
            </div>
          </div>
        </div>
      </div>

      <!-- 6. Bounding box: inside vs outside -->
      <div>
        <div class="snap-title">
          6. Bounding box — <code>edge:'inside'</code> snaps to all 4 walls from inside; <code>edge:'outside'</code> snaps to all 4 walls from outside (drag to any side)
        </div>
        <div ref="cBox" class="snap-container" style="height: 300px">
          <div class="snap-rect" style="left:25%;top:25%;width:50%;height:50%" />
          <div ref="dB1" class="snap-card" :class="{ snapped: snB1 }" :style="sB1">
            <div class="snap-label">
              {{ snB1 ? '● edge:inside' : '○ edge:inside' }}
            </div>
            <div class="snap-coords">
              {{ Math.round(xB1) }}, {{ Math.round(yB1) }}
            </div>
          </div>
          <div ref="dB2" class="snap-card" :class="{ snapped: snB2 }" :style="sB2">
            <div class="snap-label">
              {{ snB2 ? '● edge:outside' : '○ edge:outside' }}
            </div>
            <div class="snap-coords">
              {{ Math.round(xB2) }}, {{ Math.round(yB2) }}
            </div>
          </div>
        </div>
      </div>

      <!-- 7. Multiple targets + gravity + center -->
      <div>
        <div class="snap-title">
          7. Multiple targets — per-target gravity and <code>center:true</code> (element center snaps to lines at 25%, 50%, 75%)
        </div>
        <div ref="cMulti" class="snap-container">
          <div class="snap-line-v" style="left:25%;opacity:0.5" />
          <div class="snap-line-v" style="left:50%;opacity:0.9" />
          <div class="snap-line-v" style="left:75%;opacity:0.5" />
          <div class="absolute text-[10px] op40 pointer-events-none select-none" style="left:25%;top:6px;transform:translateX(-50%)">
            g:15
          </div>
          <div class="absolute text-[10px] op70 pointer-events-none select-none" style="left:50%;top:6px;transform:translateX(-50%)">
            g:60
          </div>
          <div class="absolute text-[10px] op40 pointer-events-none select-none" style="left:75%;top:6px;transform:translateX(-50%)">
            g:30
          </div>
          <div ref="dM" class="snap-card" :class="{ snapped: snM }" :style="sM">
            <div class="snap-label">
              {{ snM ? '● center:true' : '○ center:true' }}
            </div>
            <div class="snap-coords">
              {{ Math.round(xM) }}, {{ Math.round(yM) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.snap-container {
  position: relative;
  height: 240px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  overflow: hidden;
  background-color: var(--vp-c-bg-soft);
}
.snap-title {
  font-family: monospace;
  font-size: 0.75rem;
  opacity: 0.65;
  margin-bottom: 6px;
}
.snap-card {
  position: absolute;
  user-select: none;
  cursor: move;
  padding: 6px 12px;
  border-radius: 6px;
  border: 2px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg);
  font-size: 0.875rem;
  touch-action: none;
  transition:
    border-color 0.15s,
    background-color 0.15s;
}
.snap-card.snapped {
  border-color: var(--vp-c-brand);
  background-color: color-mix(in srgb, var(--vp-c-brand) 10%, var(--vp-c-bg));
}
.snap-label {
  font-family: monospace;
  font-size: 0.75rem;
  opacity: 0.4;
}
.snap-card.snapped .snap-label {
  opacity: 1;
  color: var(--vp-c-brand);
}
.snap-coords {
  font-size: 0.75rem;
  opacity: 0.4;
}
.snap-dot {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: var(--vp-c-brand);
  transform: translate(-50%, -50%);
  pointer-events: none;
}
.snap-line-v {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  background-color: var(--vp-c-brand);
  opacity: 0.6;
  pointer-events: none;
}
.snap-line-h {
  position: absolute;
  left: 0;
  right: 0;
  height: 1px;
  background-color: var(--vp-c-brand);
  opacity: 0.6;
  pointer-events: none;
}
.snap-rect {
  position: absolute;
  border: 2px solid var(--vp-c-brand);
  opacity: 0.7;
  pointer-events: none;
}
.scroll-container {
  overflow: auto !important;
}
.scroll-surface {
  position: absolute;
  top: 0;
  left: 0;
  width: 1200px;
  height: 500px;
  background-image:
    linear-gradient(to right, color-mix(in srgb, var(--vp-c-text-1) 8%, transparent) 1px, transparent 1px),
    linear-gradient(to bottom, color-mix(in srgb, var(--vp-c-text-1) 8%, transparent) 1px, transparent 1px);
  background-size: 60px 60px;
  pointer-events: none;
}
</style>
