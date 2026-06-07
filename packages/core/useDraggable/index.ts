import type { ComputedRef, MaybeRefOrGetter, Ref } from 'vue'
import type { PointerType, Position } from '../types'
import { isClient, toRefs, tryOnScopeDispose } from '@vueuse/shared'
import { computed, ref as deepRef, shallowRef, toValue, watch } from 'vue'
import { defaultWindow } from '../_configurable'
import { useEventListener } from '../useEventListener'
import { useRafFn } from '../useRafFn'

export type SnapCoordValue = number | string

export interface SnapRangeConfig {
  start?: SnapCoordValue
  end?: SnapCoordValue
  step?: SnapCoordValue
}

export type SnapAxisConfig = SnapCoordValue | SnapRangeConfig

export interface SnapBoundingRect {
  left?: SnapCoordValue
  top?: SnapCoordValue
  right?: SnapCoordValue
  bottom?: SnapCoordValue
  width?: SnapCoordValue
  height?: SnapCoordValue
}

export type DraggableBounds = SnapBoundingRect

export interface SnapTarget {
  x?: SnapAxisConfig
  y?: SnapAxisConfig
  step?: SnapCoordValue
  boundingBox?: HTMLElement | SVGElement | SnapBoundingRect
  position?: MaybeRefOrGetter<Position>
  size?: MaybeRefOrGetter<{ width: number, height: number }>
  gravity?: number
  corner?: 'tl' | 'tr' | 'bl' | 'br' | 'all'
  side?: 'start' | 'end' | 'both'
  center?: boolean
  edge?: 'inside' | 'outside' | 'both'
}

export interface SnapOptions {
  targets?: SnapCoordValue | SnapTarget | (SnapCoordValue | SnapTarget)[]
  gravity?: number
  corner?: 'tl' | 'tr' | 'bl' | 'br' | 'all'
  side?: 'start' | 'end' | 'both'
  center?: boolean
  edge?: 'inside' | 'outside' | 'both'
}

export type SnapInput = SnapCoordValue | SnapTarget | (SnapCoordValue | SnapTarget)[] | SnapOptions

export interface UseDraggableOptions {
  /**
   * Only start the dragging when click on the element directly
   *
   * @default false
   */
  exact?: MaybeRefOrGetter<boolean>

  /**
   * Prevent events defaults
   *
   * @default false
   */
  preventDefault?: MaybeRefOrGetter<boolean>

  /**
   * Prevent events propagation
   *
   * @default false
   */
  stopPropagation?: MaybeRefOrGetter<boolean>

  /**
   * Whether dispatch events in capturing phase
   *
   * @default true
   */
  capture?: boolean

  /**
   * Element to attach `pointermove` and `pointerup` events to.
   *
   * @default window
   */
  draggingElement?: MaybeRefOrGetter<HTMLElement | SVGElement | Window | Document | null | undefined>

  /**
   * Element for calculating bounds (If not set, it will use the event's target).
   *
   * @default undefined
   */
  containerElement?: MaybeRefOrGetter<HTMLElement | SVGElement | DraggableBounds | null | undefined>

  /**
   * Handle that triggers the drag event
   *
   * @default target
   */
  handle?: MaybeRefOrGetter<HTMLElement | SVGElement | null | undefined>

  /**
   * Pointer types that listen to.
   *
   * @default ['mouse', 'touch', 'pen']
   */
  pointerTypes?: PointerType[]

  /**
   * Initial position of the element.
   *
   * @default { x: 0, y: 0 }
   */
  initialValue?: MaybeRefOrGetter<Position>

  /**
   * Callback when the dragging starts. Return `false` to prevent dragging.
   */
  onStart?: (position: Position, event: PointerEvent) => void | false

  /**
   * Callback during dragging.
   */
  onMove?: (position: Position, event: PointerEvent) => void

  /**
   * Callback when dragging end.
   */
  onEnd?: (position: Position, event: PointerEvent) => void

  /**
   * Callback fired once on the first actual movement of each drag session.
   * Useful for showing drag ghosts, locking sibling elements, etc.
   */
  onMoveStart?: (position: Position, event: PointerEvent) => void

  /**
   * Pre-commit callback fired before each position update.
   * Return a new `Position` to override the computed position, `false` to cancel the move, or `void` to proceed as normal.
   */
  onBeforeMove?: (position: Position, event: PointerEvent) => Position | void | false

  /**
   * Axis to drag on.
   *
   * @default 'both'
   */
  axis?: 'x' | 'y' | 'both'

  /**
   * Disabled drag and drop.
   *
   * @default false
   */
  disabled?: MaybeRefOrGetter<boolean>

  /**
   * Mouse buttons that are allowed to trigger drag events.
   *
   * - `0`: Main button, usually the left button or the un-initialized state
   * - `1`: Auxiliary button, usually the wheel button or the middle button (if present)
   * - `2`: Secondary button, usually the right button
   * - `3`: Fourth button, typically the Browser Back button
   * - `4`: Fifth button, typically the Browser Forward button
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button#value
   * @default [0]
   */
  buttons?: MaybeRefOrGetter<number[]>

  /**
   * Whether to restrict dragging within the visible area of the container.
   *
   * If enabled, the draggable element will not leave the visible area of its container,
   * ensuring it remains within the viewport of the container during the drag.
   *
   * @default false
   */
  restrictInView?: MaybeRefOrGetter<boolean>

  /**
   * Whether to enable auto-scroll when dragging near the edges.
   *
   * @default false
   */
  autoScroll?: MaybeRefOrGetter<boolean | {
    /**
     * Speed of auto-scroll in pixels per frame.
     * Pass a `number[]` paired with `sensitivity` for tiered acceleration:
     * e.g. `speed: [40, 200, 1000]` with `sensitivity: [100, 40, 10]`.
     *
     * @default 2
     */
    speed?: MaybeRefOrGetter<number | number[] | Position>

    /**
     * Distance thresholds (px from container edge) that trigger each speed tier.
     * Must be paired with a `speed` array of the same length.
     * When provided, replaces `margin` as the outer trigger zone.
     *
     * Example: `sensitivity: [100, 40, 10]` — the further from the edge the
     * pointer is, the slower the scroll. Each value is an exclusive upper
     * bound (`dist < sensitivity[i]`), so use a positive innermost threshold.
     */
    sensitivity?: MaybeRefOrGetter<number | number[]>

    /**
     * Margin from the edge to trigger auto-scroll.
     * Ignored when `sensitivity` is provided.
     *
     * @default 30
     */
    margin?: MaybeRefOrGetter<number | Position>

    /**
     * Direction of auto-scroll.
     *
     * @default 'both'
     */
    direction?: 'x' | 'y' | 'both'

    /**
     * Minimum and maximum scroll positions (px) the auto-scroll is allowed to reach.
     * Independent of the user's manual scroll position.
     */
    minX?: number
    maxX?: number
    minY?: number
    maxY?: number
  }>

  /**
   * Snap the draggable element to points, lines, grids, or element edges.
   *
   * Examples:
   * - `{ step: 30 }` — 30×30 grid
   * - `{ x: 100 }` — vertical guide line at x=100
   * - `{ x: 100, y: { start: 0, end: '50%' } }` — vertical line at x=100, only active for y in [0, 50%]
   * - `[{ x: 100 }, { x: 300 }]` — two vertical guide lines
   * - `{ boundingBox: el }` — snap to edges of an element
   * - `{ targets: [{ step: 30 }], gravity: 15 }` — grid with custom gravity
   *
   * @default undefined
   */
  snap?: MaybeRefOrGetter<SnapInput>

  /**
   * How the element's position is applied to its `style`.
   * - `'leftTop'` (default) — emits `left: Xpx; top: Ypx;` (requires `position: fixed` or `absolute`)
   * - `'transform'` — emits `transform: translate3d(Xpx, Ypx, 0);` (GPU-accelerated, works with any CSS `position`)
   *
   * @default 'leftTop'
   */
  output?: 'leftTop' | 'transform'

  /**
   * CSS classes automatically applied to the target element.
   * - `draggable` — applied on mount
   * - `dragging` — applied while the pointer is held down
   * - `moving` — applied from the first actual movement until pointer release
   */
  classes?: {
    draggable?: string
    dragging?: string
    moving?: string
  }

  /**
   * Cursor style applied automatically.
   * - `idle` — cursor when not dragging (default `'grab'`). Pass `false` to skip.
   * - `dragging` — cursor during drag, applied to `document.body` (default `'grabbing'`). Pass `false` to skip.
   */
  cursor?: {
    idle?: string | false
    dragging?: string | false
  }

  /**
   * `z-index` applied to the element while dragging and restored on release.
   * Pass `false` to disable.
   *
   * @default false
   */
  zIndex?: number | false
}

export interface UseDraggableReturn {
  x: Ref<number>
  y: Ref<number>
  position: Ref<Position>
  isDragging: ComputedRef<boolean>
  snapped: ComputedRef<boolean>
  style: ComputedRef<string>
  recalc: () => void
}

const defaultScrollConfig = { speed: 2, margin: 30, direction: 'both' }

function clampContainerScroll(container: HTMLElement) {
  if (container.scrollLeft > container.scrollWidth - container.clientWidth)
    container.scrollLeft = Math.max(0, container.scrollWidth - container.clientWidth)
  if (container.scrollTop > container.scrollHeight - container.clientHeight)
    container.scrollTop = Math.max(0, container.scrollHeight - container.clientHeight)
}

function getScrollAxisValues(value: number | Position): [number, number] {
  return typeof value === 'number' ? [value, value] : [value.x, value.y]
}

function resolveSnapPx(value: SnapCoordValue, base: number): number {
  if (typeof value === 'string' && value.trim().endsWith('%'))
    return (Number.parseFloat(value) / 100) * base
  return Number(value)
}

function getAxisCandidates(config: SnapAxisConfig | undefined, base: number): number[] | null {
  if (config == null)
    return null
  if (typeof config === 'number' || typeof config === 'string')
    return [resolveSnapPx(config, base)]
  const { step, start, end } = config
  if (step != null) {
    const stepPx = resolveSnapPx(step, base)
    if (stepPx <= 0)
      return null
    const s = start != null ? resolveSnapPx(start, base) : 0
    const e = end != null ? resolveSnapPx(end, base) : base
    const values: number[] = []
    for (let v = s; v <= e + 1e-6; v += stepPx)
      values.push(v)
    return values.length ? values : null
  }
  return null
}

// A range-only config (`{start?, end?}` without `step`) on the perpendicular
// axis restricts the active extent of a line snap (e.g. a vertical line that
// only snaps over a portion of the container's height).
function getAxisRange(config: SnapAxisConfig | undefined, base: number): [number, number] | null {
  if (config == null || typeof config === 'number' || typeof config === 'string')
    return null
  const { step, start, end } = config
  if (step != null)
    return null
  if (start == null && end == null)
    return null
  return [
    start != null ? resolveSnapPx(start, base) : 0,
    end != null ? resolveSnapPx(end, base) : base,
  ]
}

function resolveContainerBounds(rect: DraggableBounds): { left: number, top: number, right: number, bottom: number } {
  const W = defaultWindow?.innerWidth ?? 0
  const H = defaultWindow?.innerHeight ?? 0
  const left = rect.left != null ? resolveSnapPx(rect.left, W) : 0
  const top = rect.top != null ? resolveSnapPx(rect.top, H) : 0
  const right = rect.right != null
    ? resolveSnapPx(rect.right, W)
    : left + (rect.width != null ? resolveSnapPx(rect.width, W) : W - left)
  const bottom = rect.bottom != null
    ? resolveSnapPx(rect.bottom, H)
    : top + (rect.height != null ? resolveSnapPx(rect.height, H) : H - top)
  return { left, top, right, bottom }
}

function findClosestCandidate(probe: number, candidates: number[], gravity: number): number | null {
  let best: number | null = null
  let bestDist = gravity + 1e-6
  for (const c of candidates) {
    const d = Math.abs(probe - c)
    if (d < bestDist) {
      bestDist = d
      best = c
    }
  }
  return best
}

function getBoxLines(
  box: HTMLElement | SVGElement | SnapBoundingRect,
  baseW: number,
  baseH: number,
  container: HTMLElement | SVGElement | null | undefined,
): { x: number[], y: number[] } {
  let left: number, top: number, right: number, bottom: number
  if (box instanceof Element) {
    const r = box.getBoundingClientRect()
    if (container instanceof HTMLElement) {
      const cr = container.getBoundingClientRect()
      left = r.left - cr.left + container.scrollLeft
      top = r.top - cr.top + container.scrollTop
    }
    else {
      left = r.left
      top = r.top
    }
    right = left + r.width
    bottom = top + r.height
  }
  else {
    const r = box as SnapBoundingRect
    left = r.left != null ? resolveSnapPx(r.left, baseW) : 0
    top = r.top != null ? resolveSnapPx(r.top, baseH) : 0
    right = r.right != null
      ? resolveSnapPx(r.right, baseW)
      : left + (r.width != null ? resolveSnapPx(r.width, baseW) : baseW - left)
    bottom = r.bottom != null
      ? resolveSnapPx(r.bottom, baseH)
      : top + (r.height != null ? resolveSnapPx(r.height, baseH) : baseH - top)
  }
  return { x: [left, right], y: [top, bottom] }
}

function normalizeSnapTargets(input: SnapInput): SnapTarget[] {
  const isSnapOptions = (v: unknown): v is SnapOptions =>
    typeof v === 'object' && v !== null && !Array.isArray(v) && 'targets' in v

  let rawList: (SnapCoordValue | SnapTarget)[]
  let shared: Omit<SnapOptions, 'targets'> = {}

  if (typeof input === 'number' || typeof input === 'string') {
    rawList = [input]
  }
  else if (Array.isArray(input)) {
    rawList = input
  }
  else if (isSnapOptions(input)) {
    const { targets, ...rest } = input
    shared = rest
    rawList = targets == null ? [] : Array.isArray(targets) ? targets : [targets]
  }
  else {
    rawList = [input as SnapTarget]
  }

  return rawList.map((raw) => {
    if (typeof raw === 'number' || typeof raw === 'string')
      return { ...shared, x: raw, y: raw } as SnapTarget
    const target = { ...shared, ...raw } as SnapTarget
    if (target.position != null) {
      const pos = toValue(target.position)
      const sz = target.size != null ? toValue(target.size) : { width: 0, height: 0 }
      if (sz.width === 0 && sz.height === 0) {
        return {
          ...target,
          position: undefined,
          size: undefined,
          x: pos.x,
          y: pos.y,
        } as SnapTarget
      }
      return {
        ...target,
        position: undefined,
        size: undefined,
        boundingBox: { left: pos.x, top: pos.y, right: pos.x + sz.width, bottom: pos.y + sz.height },
      } as SnapTarget
    }
    return target
  })
}

function computeSnap(
  pos: Position,
  size: { width: number, height: number },
  snapInput: SnapInput,
  baseW: number,
  baseH: number,
  container: HTMLElement | SVGElement | null | undefined,
): { position: Position, snapped: boolean } {
  const targets = normalizeSnapTargets(snapInput)
  let sx = pos.x
  let sy = pos.y
  let bestXDist = Infinity
  let bestYDist = Infinity
  let isSnapped = false

  for (const target of targets) {
    const gravity = target.gravity ?? 20
    const corner = target.corner ?? 'tl'
    const side = target.side ?? 'both'
    const center = target.center ?? false
    const edge = target.edge ?? 'both'

    if (target.boundingBox) {
      const lines = getBoxLines(target.boundingBox, baseW, baseH, container)
      const [xMin, xMax] = lines.x
      const [yMin, yMax] = lines.y
      for (let ei = 0; ei < lines.x.length; ei++) {
        // Only snap to a vertical wall if the element overlaps the box in Y
        if (pos.y + size.height <= yMin || pos.y >= yMax)
          continue
        const xLine = lines.x[ei]
        const isStart = ei === 0
        const xOffs = center
          ? [size.width / 2]
          : edge === 'inside'
            ? [isStart ? 0 : size.width]
            : edge === 'outside'
              ? [isStart ? size.width : 0]
              : [0, size.width]
        for (const off of xOffs) {
          const snapTo = findClosestCandidate(pos.x + off, [xLine], gravity)
          if (snapTo != null) {
            const d = Math.abs(pos.x + off - snapTo)
            if (d < bestXDist) {
              bestXDist = d
              sx = snapTo - off
              isSnapped = true
            }
          }
        }
      }
      for (let ei = 0; ei < lines.y.length; ei++) {
        // Only snap to a horizontal wall if the element overlaps the box in X
        if (pos.x + size.width <= xMin || pos.x >= xMax)
          continue
        const yLine = lines.y[ei]
        const isStart = ei === 0
        const yOffs = center
          ? [size.height / 2]
          : edge === 'inside'
            ? [isStart ? 0 : size.height]
            : edge === 'outside'
              ? [isStart ? size.height : 0]
              : [0, size.height]
        for (const off of yOffs) {
          const snapTo = findClosestCandidate(pos.y + off, [yLine], gravity)
          if (snapTo != null) {
            const d = Math.abs(pos.y + off - snapTo)
            if (d < bestYDist) {
              bestYDist = d
              sy = snapTo - off
              isSnapped = true
            }
          }
        }
      }
      continue
    }

    const xCfg: SnapAxisConfig | undefined = target.step != null
      ? { ...(typeof target.x === 'object' ? target.x as SnapRangeConfig : {}), step: target.step }
      : target.x
    const yCfg: SnapAxisConfig | undefined = target.step != null
      ? { ...(typeof target.y === 'object' ? target.y as SnapRangeConfig : {}), step: target.step }
      : target.y
    const xCandidates = getAxisCandidates(xCfg, baseW)
    const yCandidates = getAxisCandidates(yCfg, baseH)
    const isPoint = xCandidates != null && yCandidates != null

    if (isPoint) {
      // Point target: both axes must be within gravity for the same corner probe
      const xOffsets = center
        ? [size.width / 2]
        : (corner === 'all' ? [0, size.width] : (corner === 'tr' || corner === 'br') ? [size.width] : [0])
      const yOffsets = center
        ? [size.height / 2]
        : (corner === 'all' ? [0, size.height] : (corner === 'bl' || corner === 'br') ? [size.height] : [0])
      for (const xOff of xOffsets) {
        const xSnapTo = findClosestCandidate(pos.x + xOff, xCandidates!, gravity)
        if (xSnapTo == null)
          continue
        for (const yOff of yOffsets) {
          const ySnapTo = findClosestCandidate(pos.y + yOff, yCandidates!, gravity)
          if (ySnapTo == null)
            continue
          const xDist = Math.abs(pos.x + xOff - xSnapTo)
          const yDist = Math.abs(pos.y + yOff - ySnapTo)
          if (xDist < bestXDist) {
            bestXDist = xDist
            sx = xSnapTo - xOff
            isSnapped = true
          }
          if (yDist < bestYDist) {
            bestYDist = yDist
            sy = ySnapTo - yOff
            isSnapped = true
          }
        }
      }
    }
    else {
      if (xCandidates != null) {
        // Vertical line: an optional y-axis range restricts the line's active extent
        const yRange = yCandidates == null ? getAxisRange(yCfg, baseH) : null
        const yOverlaps = yRange == null
          || (pos.y + size.height >= yRange[0] && pos.y <= yRange[1])
        if (yOverlaps) {
          const offsets = center
            ? [size.width / 2]
            : (side === 'start' ? [0] : side === 'end' ? [size.width] : [0, size.width])
          for (const off of offsets) {
            const snapTo = findClosestCandidate(pos.x + off, xCandidates, gravity)
            if (snapTo != null) {
              const d = Math.abs(pos.x + off - snapTo)
              if (d < bestXDist) {
                bestXDist = d
                sx = snapTo - off
                isSnapped = true
              }
            }
          }
        }
      }
      if (yCandidates != null) {
        // Horizontal line: an optional x-axis range restricts the line's active extent
        const xRange = xCandidates == null ? getAxisRange(xCfg, baseW) : null
        const xOverlaps = xRange == null
          || (pos.x + size.width >= xRange[0] && pos.x <= xRange[1])
        if (xOverlaps) {
          const offsets = center
            ? [size.height / 2]
            : (side === 'start' ? [0] : side === 'end' ? [size.height] : [0, size.height])
          for (const off of offsets) {
            const snapTo = findClosestCandidate(pos.y + off, yCandidates, gravity)
            if (snapTo != null) {
              const d = Math.abs(pos.y + off - snapTo)
              if (d < bestYDist) {
                bestYDist = d
                sy = snapTo - off
                isSnapped = true
              }
            }
          }
        }
      }
    }
  }

  return { position: { x: sx, y: sy }, snapped: isSnapped }
}

/**
 * @param dist
 * @param speed
 * @param axis
 * @param sensitivity
 */
function computeAxisSpeed(
  dist: number,
  speed: number | number[] | Position,
  axis: 'x' | 'y',
  sensitivity: number | number[] | undefined,
): number {
  if (Array.isArray(speed) && Array.isArray(sensitivity)) {
    let bestSens = Infinity
    let bestSpeed = 0
    for (let i = 0; i < sensitivity.length; i++) {
      const s = sensitivity[i]
      if (dist < s && s < bestSens) {
        bestSens = s
        bestSpeed = speed[Math.min(i, speed.length - 1)]
      }
    }
    return bestSpeed
  }
  return Array.isArray(speed)
    ? speed[speed.length - 1]
    : typeof speed === 'number'
      ? speed
      : axis === 'x' ? speed.x : speed.y
}

export function useDraggable(
  target: MaybeRefOrGetter<HTMLElement | SVGElement | null | undefined>,
  options: UseDraggableOptions = {},
): UseDraggableReturn {
  const {
    pointerTypes,
    preventDefault,
    stopPropagation,
    exact,
    onMove,
    onEnd,
    onStart,
    initialValue,
    axis = 'both',
    draggingElement = defaultWindow,
    containerElement,
    handle: draggingHandle = target,
    buttons = [0],
    restrictInView,
    autoScroll = false,
    snap,
    output = 'leftTop',
    onMoveStart,
    onBeforeMove,
    classes,
    cursor,
    zIndex = false,
  } = options

  const position = deepRef<Position>(
    toValue(initialValue) ?? { x: 0, y: 0 },
  )

  const pressedDelta = deepRef<Position>()
  const snapState = shallowRef(false)
  let hasMoved = false

  let savedZIndex = ''

  if (isClient) {
    watch(
      () => toValue(draggingHandle),
      (el) => {
        if (!el)
          return
        if (classes?.draggable)
          el.classList.add(classes.draggable)
        if (cursor && cursor.idle !== false)
          (el as HTMLElement).style.cursor = cursor.idle ?? 'grab'
      },
      { immediate: true },
    )
  }

  const filterEvent = (e: PointerEvent) => {
    if (pointerTypes)
      return pointerTypes.includes(e.pointerType as PointerType)
    return true
  }

  const handleEvent = (e: PointerEvent) => {
    if (toValue(preventDefault))
      e.preventDefault()
    if (toValue(stopPropagation))
      e.stopPropagation()
  }

  const scrollConfig = toValue(autoScroll)
  interface ResolvedScrollSettings {
    speed: number | number[] | Position
    sensitivity?: number | number[]
    margin: number | Position
    direction: string
    minX?: number
    maxX?: number
    minY?: number
    maxY?: number
  }
  const scrollSettings: ResolvedScrollSettings = typeof scrollConfig === 'object'
    ? {
        speed: toValue(scrollConfig.speed) ?? defaultScrollConfig.speed,
        sensitivity: toValue(scrollConfig.sensitivity),
        margin: toValue(scrollConfig.margin) ?? defaultScrollConfig.margin,
        direction: scrollConfig.direction ?? defaultScrollConfig.direction,
        minX: scrollConfig.minX,
        maxX: scrollConfig.maxX,
        minY: scrollConfig.minY,
        maxY: scrollConfig.maxY,
      }
    : { ...defaultScrollConfig }

  const handleAutoScroll = (
    container: HTMLElement | SVGElement,
    targetRect: DOMRect,
    position: Position,
  ) => {
    const { clientWidth, clientHeight, scrollLeft, scrollTop, scrollWidth, scrollHeight } = container

    const [marginX, marginY] = getScrollAxisValues(scrollSettings.margin)
    const { sensitivity } = scrollSettings
    const effectiveTrigger = Array.isArray(sensitivity) && sensitivity.length > 0
      ? Math.max(...sensitivity)
      : typeof sensitivity === 'number'
        ? sensitivity
        : null
    const triggerX = effectiveTrigger ?? marginX
    const triggerY = effectiveTrigger ?? marginY

    let deltaX = 0
    let deltaY = 0

    if (scrollSettings.direction === 'x' || scrollSettings.direction === 'both') {
      const distLeft = position.x
      const distRight = clientWidth - (position.x + targetRect.width)
      if (distLeft < triggerX && scrollLeft > 0)
        deltaX = -computeAxisSpeed(distLeft, scrollSettings.speed, 'x', sensitivity)
      else if (distRight < triggerX && scrollLeft < scrollWidth - clientWidth)
        deltaX = computeAxisSpeed(distRight, scrollSettings.speed, 'x', sensitivity)
    }

    if (scrollSettings.direction === 'y' || scrollSettings.direction === 'both') {
      const distTop = position.y
      const distBottom = clientHeight - (position.y + targetRect.height)
      if (distTop < triggerY && scrollTop > 0)
        deltaY = -computeAxisSpeed(distTop, scrollSettings.speed, 'y', sensitivity)
      else if (distBottom < triggerY && scrollTop < scrollHeight - clientHeight)
        deltaY = computeAxisSpeed(distBottom, scrollSettings.speed, 'y', sensitivity)
    }

    if (scrollSettings.minX !== undefined || scrollSettings.maxX !== undefined) {
      const next = scrollLeft + deltaX
      const clamped = Math.min(Math.max(next, scrollSettings.minX ?? -Infinity), scrollSettings.maxX ?? Infinity)
      deltaX = clamped - scrollLeft
    }
    if (scrollSettings.minY !== undefined || scrollSettings.maxY !== undefined) {
      const next = scrollTop + deltaY
      const clamped = Math.min(Math.max(next, scrollSettings.minY ?? -Infinity), scrollSettings.maxY ?? Infinity)
      deltaY = clamped - scrollTop
    }

    if (deltaX || deltaY) {
      container.scrollBy({ left: deltaX, top: deltaY, behavior: 'auto' })
    }
  }

  // Auto-scroll runs via requestAnimationFrame (useRafFn) rather than setInterval:
  // it's more efficient, pauses automatically when the tab is hidden, and is
  // cleaned up on scope dispose. `fpsLimit: 60` preserves the original ~16.7ms
  // cadence so scroll speed stays consistent across display refresh rates.
  const {
    pause: stopAutoScroll,
    resume: resumeAutoScroll,
    isActive: isAutoScrolling,
  } = useRafFn(() => {
    const container = toValue(containerElement)
    if (!(container instanceof Element))
      return
    const targetRect = toValue(target)!.getBoundingClientRect()
    const { x, y } = position.value
    const relativePosition = { x: x - container.scrollLeft, y: y - container.scrollTop }
    if (relativePosition.x >= 0 && relativePosition.y >= 0) {
      handleAutoScroll(container, targetRect, relativePosition)
      relativePosition.x += container.scrollLeft
      relativePosition.y += container.scrollTop
      position.value = relativePosition
    }
  }, { immediate: false, fpsLimit: 60 })

  const startAutoScroll = () => {
    if (toValue(containerElement) instanceof Element && !isAutoScrolling.value)
      resumeAutoScroll()
  }
  const isPointerNearEdge = (
    pointer: Position,
    container: HTMLElement | SVGElement,
    margin: number | Position,
    targetRect: DOMRect,
  ) => {
    const [marginX, marginY] = getScrollAxisValues(margin)
    const { clientWidth, clientHeight } = container
    return (
      pointer.x < marginX
      || pointer.x + targetRect.width > clientWidth - marginX
      || pointer.y < marginY
      || pointer.y + targetRect.height > clientHeight - marginY
    )
  }
  const checkAutoScroll = () => {
    if (toValue(options.disabled) || !pressedDelta.value)
      return
    const container = toValue(containerElement)
    if (!(container instanceof Element))
      return
    const targetRect = toValue(target)!.getBoundingClientRect()
    const { x, y } = position.value
    const relativePosition = { x: x - container.scrollLeft, y: y - container.scrollTop }

    const { sensitivity } = scrollSettings
    const effectiveMargin: number | Position = Array.isArray(sensitivity) && sensitivity.length > 0
      ? Math.max(...sensitivity)
      : typeof sensitivity === 'number'
        ? sensitivity
        : scrollSettings.margin
    if (isPointerNearEdge(relativePosition, container, effectiveMargin, targetRect))
      startAutoScroll()
    else stopAutoScroll()
  }

  if (toValue(autoScroll)) {
    watch(position, checkAutoScroll)
  }

  const resolveContainer = () => {
    const container = toValue(containerElement)
    const domContainer = container instanceof Element ? container as HTMLElement | SVGElement : null
    const containerBounds = container != null && !(container instanceof Element)
      ? resolveContainerBounds(container as DraggableBounds)
      : null
    return { domContainer, containerBounds }
  }

  const applySnapAndClamp = (
    pos: Position,
    targetRect: DOMRect,
    domContainer: HTMLElement | SVGElement | null,
    containerBounds: { left: number, top: number, right: number, bottom: number } | null,
  ): Position => {
    let { x, y } = pos
    const snapValue = toValue(snap)
    if (snapValue) {
      const baseW = domContainer instanceof HTMLElement ? domContainer.clientWidth : (defaultWindow?.innerWidth ?? 0)
      const baseH = domContainer instanceof HTMLElement ? domContainer.clientHeight : (defaultWindow?.innerHeight ?? 0)
      const snapResult = computeSnap(
        { x, y },
        { width: targetRect.width, height: targetRect.height },
        snapValue,
        baseW,
        baseH,
        domContainer,
      )
      if (axis === 'x' || axis === 'both')
        x = snapResult.position.x
      if (axis === 'y' || axis === 'both')
        y = snapResult.position.y
      snapState.value = snapResult.snapped
    }
    else {
      snapState.value = false
    }
    if (domContainer) {
      if (axis === 'x' || axis === 'both')
        x = Math.min(Math.max(0, x), domContainer.scrollWidth - targetRect.width)
      if (axis === 'y' || axis === 'both')
        y = Math.min(Math.max(0, y), domContainer.scrollHeight - targetRect.height)
    }
    else if (containerBounds) {
      if (axis === 'x' || axis === 'both')
        x = Math.min(Math.max(containerBounds.left, x), containerBounds.right - targetRect.width)
      if (axis === 'y' || axis === 'both')
        y = Math.min(Math.max(containerBounds.top, y), containerBounds.bottom - targetRect.height)
    }
    return { x, y }
  }

  const start = (e: PointerEvent) => {
    if (!toValue(buttons).includes(e.button))
      return
    if (toValue(options.disabled) || !filterEvent(e))
      return
    if (toValue(exact) && e.target !== toValue(target))
      return

    const container = toValue(containerElement)
    const domContainer = container instanceof Element ? container as HTMLElement | SVGElement : null
    const containerRect = domContainer?.getBoundingClientRect?.()
    const targetRect = toValue(target)!.getBoundingClientRect()
    const pos = {
      x: e.clientX - (domContainer ? targetRect.left - containerRect!.left + (toValue(autoScroll) ? 0 : domContainer.scrollLeft) : targetRect.left),
      y: e.clientY - (domContainer ? targetRect.top - containerRect!.top + (toValue(autoScroll) ? 0 : domContainer.scrollTop) : targetRect.top),
    }
    if (onStart?.(pos, e) === false)
      return
    hasMoved = false
    if (classes?.dragging)
      toValue(target)?.classList.add(classes.dragging)
    if (cursor && cursor.dragging !== false && isClient)
      document.body.style.cursor = cursor.dragging ?? 'grabbing'
    if (zIndex) {
      const el = toValue(target) as HTMLElement | null
      if (el) {
        savedZIndex = el.style.zIndex
        el.style.zIndex = String(zIndex)
      }
    }
    pressedDelta.value = pos
    handleEvent(e)
  }

  const move = (e: PointerEvent) => {
    if (toValue(options.disabled) || !filterEvent(e))
      return
    if (!pressedDelta.value)
      return

    const { domContainer, containerBounds } = resolveContainer()
    if (domContainer instanceof HTMLElement)
      clampContainerScroll(domContainer)

    const targetRect = toValue(target)!.getBoundingClientRect()
    let { x, y } = position.value
    if (axis === 'x' || axis === 'both')
      x = e.clientX - pressedDelta.value.x
    if (axis === 'y' || axis === 'both')
      y = e.clientY - pressedDelta.value.y
    ;({ x, y } = applySnapAndClamp({ x, y }, targetRect, domContainer, containerBounds))

    if (toValue(autoScroll) && domContainer) {
      if (!isAutoScrolling.value)
        handleAutoScroll(domContainer, targetRect, { x, y })

      x += domContainer.scrollLeft
      y += domContainer.scrollTop
    }
    if (domContainer && (toValue(restrictInView) || toValue(autoScroll))) {
      if (axis !== 'y') {
        const relativeX = x - domContainer.scrollLeft
        if (relativeX < 0)
          x = domContainer.scrollLeft
        else if (relativeX > domContainer.clientWidth - targetRect.width)
          x = domContainer.clientWidth - targetRect.width + domContainer.scrollLeft
      }
      if (axis !== 'x') {
        const relativeY = y - domContainer.scrollTop
        if (relativeY < 0)
          y = domContainer.scrollTop
        else if (relativeY > domContainer.clientHeight - targetRect.height)
          y = domContainer.clientHeight - targetRect.height + domContainer.scrollTop
      }
    }

    if (onBeforeMove) {
      const override = onBeforeMove({ x, y }, e)
      if (override === false) {
        handleEvent(e)
        return
      }
      if (override !== undefined) {
        x = override.x
        y = override.y
      }
    }
    if (!hasMoved) {
      hasMoved = true
      if (classes?.moving)
        toValue(target)?.classList.add(classes.moving)
      onMoveStart?.({ x, y }, e)
    }
    position.value = {
      x,
      y,
    }
    onMove?.(position.value, e)
    handleEvent(e)
  }
  const end = (e: PointerEvent) => {
    if (toValue(options.disabled) || !filterEvent(e))
      return
    if (!pressedDelta.value)
      return
    pressedDelta.value = undefined
    if (classes?.dragging)
      toValue(target)?.classList.remove(classes.dragging)
    if (classes?.moving)
      toValue(target)?.classList.remove(classes.moving)
    if (cursor && cursor.dragging !== false && isClient)
      document.body.style.cursor = ''
    if (zIndex) {
      const el = toValue(target) as HTMLElement | null
      if (el)
        el.style.zIndex = savedZIndex
    }
    if (toValue(autoScroll))
      stopAutoScroll()
    onEnd?.(position.value, e)
    handleEvent(e)
  }

  const recalc = () => {
    if (!isClient)
      return
    const targetEl = toValue(target)
    if (!targetEl)
      return
    const targetRect = targetEl.getBoundingClientRect()
    const { domContainer, containerBounds } = resolveContainer()
    position.value = applySnapAndClamp(position.value, targetRect, domContainer, containerBounds)
  }

  if (isClient) {
    const config = () => ({
      capture: options.capture ?? true,
      passive: !toValue(preventDefault),
    })
    useEventListener(draggingHandle, 'pointerdown', start, config)
    useEventListener(draggingElement, 'pointermove', move, config)
    useEventListener(draggingElement, 'pointerup', end, config)
  }

  tryOnScopeDispose(() => {
    stopAutoScroll()
    // reset the body cursor if disposed while still dragging
    if (isClient && pressedDelta.value && cursor && cursor.dragging !== false)
      document.body.style.cursor = ''
  })

  return {
    ...toRefs(position),
    position,
    isDragging: computed(() => !!pressedDelta.value),
    snapped: computed(() => snapState.value),
    style: computed(() => {
      const nowrap = toValue(autoScroll) ? ' text-wrap: nowrap;' : ''
      return output === 'transform'
        ? `transform: translate3d(${position.value.x}px, ${position.value.y}px, 0);${nowrap}`
        : `left: ${position.value.x}px; top: ${position.value.y}px;${nowrap}`
    }),
    recalc,
  }
}
