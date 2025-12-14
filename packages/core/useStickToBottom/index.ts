import type { ComputedRef, Ref } from 'vue'
import type { MaybeComputedElementRef } from '../unrefElement'
import { computed, onBeforeUnmount, shallowRef, watch } from 'vue'
import { unrefElement } from '../unrefElement'
import { useEventListener } from '../useEventListener'

const DEFAULT_SPRING_ANIMATION = {
  damping: 0.7,
  stiffness: 0.05,
  mass: 1.25,
}

export interface SpringAnimation {
  damping?: number
  stiffness?: number
  mass?: number
}

export type Animation = ScrollBehavior | SpringAnimation

export interface ScrollElements {
  scrollElement: HTMLElement
  contentElement: HTMLElement
}

export type GetTargetScrollTop = (targetScrollTop: number, context: ScrollElements) => number

export interface UseStickToBottomOptions extends SpringAnimation {
  /** Scrollable element (the element with `scrollTop`) */
  scrollElement: MaybeComputedElementRef<HTMLElement | null>

  /** Content container element (ResizeObserver will observe its size changes) */
  contentElement: MaybeComputedElementRef<HTMLElement | null>

  /** Animation used when content size changes */
  resize?: Animation

  /** Initial animation; set `false` to disable automatic sticking on mount */
  initial?: Animation | boolean

  /** Customize target scrollTop */
  targetScrollTop?: GetTargetScrollTop

  /** Threshold (px) considered as "near bottom" */
  offset?: number
}

export type ScrollToBottomOptions
  = | ScrollBehavior
    | {
      animation?: Animation
      wait?: boolean | number
      ignoreEscapes?: boolean
      preserveScrollPosition?: boolean
      duration?: number | Promise<void>
    }

export interface UseStickToBottomReturn {
  isAtBottom: ComputedRef<boolean>
  isNearBottom: Ref<boolean>
  escapedFromLock: Ref<boolean>
  showScrollToBottom: ComputedRef<boolean>
  scrollToBottom: (smooth?: boolean) => Promise<boolean> | boolean
  scrollToBottomAndResume: (smooth?: boolean) => Promise<boolean> | boolean
  stopScroll: () => void
}

const SIXTY_FPS_INTERVAL_MS = 1000 / 60
const RETAIN_ANIMATION_DURATION_MS = 350

const animationCache = new Map<string, Readonly<Required<SpringAnimation>>>()

function mergeAnimations(...animations: (Animation | boolean | undefined)[]) {
  const result: Required<SpringAnimation> = {
    damping: DEFAULT_SPRING_ANIMATION.damping,
    stiffness: DEFAULT_SPRING_ANIMATION.stiffness,
    mass: DEFAULT_SPRING_ANIMATION.mass,
  }

  let instant = false

  for (const animation of animations) {
    if (animation === 'instant') {
      instant = true
      continue
    }

    if (typeof animation !== 'object')
      continue

    instant = false
    result.damping = animation.damping ?? result.damping
    result.stiffness = animation.stiffness ?? result.stiffness
    result.mass = animation.mass ?? result.mass
  }

  const key = JSON.stringify(result)
  if (!animationCache.has(key))
    animationCache.set(key, Object.freeze(result))

  return instant ? 'instant' : animationCache.get(key)!
}

let mouseDown = false
let mouseTrackingReady = false

function ensureMouseTracking() {
  if (mouseTrackingReady)
    return
  mouseTrackingReady = true

  globalThis.document?.addEventListener('mousedown', () => {
    mouseDown = true
  })
  globalThis.document?.addEventListener('mouseup', () => {
    mouseDown = false
  })
  globalThis.document?.addEventListener('click', () => {
    mouseDown = false
  })
}

function raf(cb: FrameRequestCallback) {
  if (globalThis.requestAnimationFrame)
    return globalThis.requestAnimationFrame(cb)

  return setTimeout(() => cb(Date.now()), 16) as unknown as number
}

function now() {
  return globalThis.performance?.now?.() ?? Date.now()
}

function isScrollableElement(el: unknown): el is HTMLElement {
  return !!el && typeof el === 'object' && 'scrollTop' in (el as any) && 'scrollHeight' in (el as any)
}

function rafPromise() {
  return new Promise<void>(resolve => raf(() => resolve()))
}

/**
 * Smoothly stick a scroll container to the bottom, with escape handling.
 */
export function useStickToBottom(options: UseStickToBottomOptions): UseStickToBottomReturn {
  ensureMouseTracking()

  const {
    scrollElement,
    contentElement,
    offset = 70,
    resize,
    initial,
    targetScrollTop,
    damping,
    stiffness,
    mass,
  } = options

  const escapedFromLock = shallowRef(false)
  const isAtBottomLocked = shallowRef(initial !== false)
  const isNearBottom = shallowRef(false)

  const resolvedScrollElement = computed<HTMLElement | null>(() => {
    const el = unrefElement(scrollElement) as unknown
    return isScrollableElement(el) ? (el as HTMLElement) : null
  })

  const resolvedContentElement = computed<HTMLElement | null>(() => {
    const el = unrefElement(contentElement) as unknown
    return el ? (el as HTMLElement) : null
  })

  const isAtBottom = computed(() => isAtBottomLocked.value || isNearBottom.value)

  const showScrollToBottom = computed(() => !isAtBottom.value)

  const state = {
    lastScrollTop: undefined as number | undefined,
    ignoreScrollToTop: undefined as number | undefined,
    resizeDifference: 0,
    lastTick: undefined as number | undefined,
    velocity: 0,
    accumulated: 0,
    animation: undefined as
    | {
      behavior: 'instant' | Required<SpringAnimation>
      ignoreEscapes: boolean
      promise: Promise<boolean>
    }
    | undefined,
  }

  function getScrollTop() {
    return resolvedScrollElement.value?.scrollTop ?? 0
  }

  function setScrollTop(value: number) {
    const viewport = resolvedScrollElement.value
    if (!viewport)
      return
    viewport.scrollTop = value
    state.ignoreScrollToTop = viewport.scrollTop
  }

  function getTargetScrollTop() {
    const viewport = resolvedScrollElement.value
    const content = resolvedContentElement.value
    if (!viewport || !content)
      return 0
    return viewport.scrollHeight - 1 - viewport.clientHeight
  }

  let lastCalculation:
    | {
      targetScrollTop: number
      calculatedScrollTop: number
    }
    | undefined

  function getCalculatedTargetScrollTop() {
    const viewport = resolvedScrollElement.value
    const content = resolvedContentElement.value
    if (!viewport || !content)
      return 0

    const target = getTargetScrollTop()
    if (!targetScrollTop)
      return target

    if (lastCalculation?.targetScrollTop === target)
      return lastCalculation.calculatedScrollTop

    const calculated = Math.max(
      Math.min(
        targetScrollTop(target, { scrollElement: viewport, contentElement: content }),
        target,
      ),
      0,
    )

    lastCalculation = { targetScrollTop: target, calculatedScrollTop: calculated }
    raf(() => {
      lastCalculation = undefined
    })

    return calculated
  }

  function getScrollDifference() {
    return getCalculatedTargetScrollTop() - getScrollTop()
  }

  function computeIsNearBottom() {
    return getScrollDifference() <= offset
  }

  function isSelecting() {
    const viewport = resolvedScrollElement.value
    if (!viewport || !mouseDown)
      return false

    const selection = globalThis.getSelection?.()
    if (!selection || !selection.rangeCount)
      return false

    if (typeof Node === 'undefined')
      return false

    const range = selection.getRangeAt(0)
    const ancestor = range.commonAncestorContainer
    const node
      = ancestor.nodeType === Node.ELEMENT_NODE ? (ancestor as Element) : ancestor.parentElement
    if (!node)
      return false

    return node.contains(viewport) || viewport.contains(node)
  }

  function setIsAtBottomLocked(nextValue: boolean) {
    isAtBottomLocked.value = nextValue
  }

  function setEscapedFromLock(nextValue: boolean) {
    escapedFromLock.value = nextValue
  }

  const scrollToBottomInternal = (scrollOptions: ScrollToBottomOptions = {}) => {
    const viewport = resolvedScrollElement.value
    const content = resolvedContentElement.value
    if (!viewport || !content)
      return false

    if (typeof scrollOptions === 'string')
      scrollOptions = { animation: scrollOptions }

    if (!scrollOptions.preserveScrollPosition)
      setIsAtBottomLocked(true)

    const waitElapsed = Date.now() + (Number(scrollOptions.wait) || 0)
    const behavior = mergeAnimations({ damping, stiffness, mass }, scrollOptions.animation)

    const { ignoreEscapes = false } = scrollOptions
    let durationElapsed: number
    let startTarget = getCalculatedTargetScrollTop()

    if (scrollOptions.duration instanceof Promise) {
      scrollOptions.duration.finally(() => {
        durationElapsed = Date.now()
      })
    }
    else {
      durationElapsed = waitElapsed + (scrollOptions.duration ?? 0)
    }

    const next = async (): Promise<boolean> => {
      const promise = rafPromise().then(() => {
        if (!isAtBottomLocked.value) {
          state.animation = undefined
          return false
        }

        const scrollTop = getScrollTop()
        const tick = now()
        const tickDelta = (tick - (state.lastTick ?? tick)) / SIXTY_FPS_INTERVAL_MS

        state.animation ||= { behavior, promise, ignoreEscapes }
        if (state.animation.behavior === behavior)
          state.lastTick = tick

        if (isSelecting())
          return next()

        if (waitElapsed > Date.now())
          return next()

        const calculatedTarget = getCalculatedTargetScrollTop()
        if (scrollTop < Math.min(startTarget, calculatedTarget)) {
          if (state.animation?.behavior === behavior) {
            if (behavior === 'instant') {
              setScrollTop(calculatedTarget)
              return next()
            }

            state.velocity
              = (behavior.damping * state.velocity + behavior.stiffness * getScrollDifference())
                / behavior.mass

            state.accumulated += state.velocity * tickDelta
            setScrollTop(scrollTop + state.accumulated)

            if (getScrollTop() !== scrollTop)
              state.accumulated = 0
          }

          return next()
        }

        if (durationElapsed > Date.now()) {
          startTarget = calculatedTarget
          return next()
        }

        state.animation = undefined

        if (getScrollTop() < getCalculatedTargetScrollTop()) {
          return scrollToBottomInternal({
            animation: mergeAnimations({ damping, stiffness, mass }, resize),
            ignoreEscapes,
            duration: Math.max(0, durationElapsed - Date.now()) || undefined,
          })
        }

        return isAtBottomLocked.value
      })

      return promise.then((ok) => {
        raf(() => {
          if (!state.animation) {
            state.lastTick = undefined
            state.velocity = 0
          }
        })
        return ok
      })
    }

    if (scrollOptions.wait !== true)
      state.animation = undefined

    if (state.animation?.behavior === behavior)
      return state.animation.promise

    const promise = next()
    state.animation ||= { behavior, promise, ignoreEscapes }

    return promise
  }

  const scrollToBottom = (smooth = false) => {
    return scrollToBottomInternal({ animation: smooth ? 'smooth' : 'instant' })
  }

  const scrollToBottomAndResume = (smooth = false) => {
    setEscapedFromLock(false)
    setIsAtBottomLocked(true)
    return scrollToBottom(smooth)
  }

  const stopScroll = () => {
    setEscapedFromLock(true)
    setIsAtBottomLocked(false)
  }

  function handleScroll(target: EventTarget | null) {
    const viewport = resolvedScrollElement.value
    if (!viewport || target !== viewport)
      return

    const scrollTop = getScrollTop()
    const ignoreScrollToTop = state.ignoreScrollToTop
    let lastScrollTop = state.lastScrollTop ?? scrollTop

    state.lastScrollTop = scrollTop
    state.ignoreScrollToTop = undefined

    if (ignoreScrollToTop && ignoreScrollToTop > scrollTop)
      lastScrollTop = ignoreScrollToTop

    isNearBottom.value = computeIsNearBottom()

    setTimeout(() => {
      if (state.resizeDifference || scrollTop === ignoreScrollToTop)
        return

      if (isSelecting()) {
        setEscapedFromLock(true)
        setIsAtBottomLocked(false)
        return
      }

      const isScrollingDown = scrollTop > lastScrollTop
      const isScrollingUp = scrollTop < lastScrollTop

      if (state.animation?.ignoreEscapes) {
        setScrollTop(lastScrollTop)
        return
      }

      if (isScrollingUp) {
        setEscapedFromLock(true)
        setIsAtBottomLocked(false)
      }

      if (isScrollingDown)
        setEscapedFromLock(false)

      if (!escapedFromLock.value && computeIsNearBottom())
        setIsAtBottomLocked(true)
    }, 1)
  }

  function handleWheel(target: EventTarget | null, deltaY: number) {
    const viewport = resolvedScrollElement.value
    if (!viewport)
      return

    let element = target as HTMLElement | null
    while (element && globalThis.getComputedStyle && !['scroll', 'auto'].includes(getComputedStyle(element).overflow))
      element = element.parentElement

    if (
      element === viewport
      && deltaY < 0
      && viewport.scrollHeight > viewport.clientHeight
      && !state.animation?.ignoreEscapes
    ) {
      setEscapedFromLock(true)
      setIsAtBottomLocked(false)
    }
  }

  useEventListener(resolvedScrollElement, 'scroll', e => handleScroll(e.target), { passive: true })
  useEventListener(
    resolvedScrollElement,
    'wheel',
    e => handleWheel(e.target, (e as WheelEvent).deltaY),
    {
      passive: true,
    },
  )

  let resizeObserver: ResizeObserver | undefined
  let previousHeight: number | undefined

  watch(
    () => resolvedContentElement.value,
    (content, _prev, onCleanup) => {
      resizeObserver?.disconnect()
      resizeObserver = undefined
      previousHeight = undefined

      if (!content)
        return

      if (typeof ResizeObserver === 'undefined')
        return

      resizeObserver = new ResizeObserver((entries) => {
        const viewport = resolvedScrollElement.value
        if (!viewport)
          return

        const entry = entries[0]
        if (!entry)
          return

        const height = entry.contentRect.height
        const difference = height - (previousHeight ?? height)

        state.resizeDifference = difference

        if (getScrollTop() > getTargetScrollTop())
          setScrollTop(getTargetScrollTop())

        isNearBottom.value = computeIsNearBottom()

        if (difference >= 0) {
          const animation = mergeAnimations(
            { damping, stiffness, mass },
            previousHeight ? resize : initial,
          )

          scrollToBottomInternal({
            animation,
            wait: true,
            preserveScrollPosition: true,
            duration: animation === 'instant' ? undefined : RETAIN_ANIMATION_DURATION_MS,
          })
        }
        else {
          if (computeIsNearBottom()) {
            setEscapedFromLock(false)
            setIsAtBottomLocked(true)
          }
        }

        previousHeight = height

        raf(() => {
          setTimeout(() => {
            if (state.resizeDifference === difference)
              state.resizeDifference = 0
          }, 1)
        })
      })

      resizeObserver.observe(content)
      onCleanup(() => resizeObserver?.disconnect())
    },
    { immediate: true },
  )

  let didInitialScroll = false
  watch(
    () => [resolvedScrollElement.value, resolvedContentElement.value] as const,
    ([_viewport, content]) => {
      if (didInitialScroll)
        return
      if (!content)
        return
      if (!resolvedScrollElement.value)
        return
      if (initial === false)
        return

      didInitialScroll = true
      scrollToBottomInternal({ animation: mergeAnimations({ damping, stiffness, mass }, initial) })
    },
    { immediate: true },
  )

  onBeforeUnmount(() => {
    resizeObserver?.disconnect()
  })

  return {
    isAtBottom,
    isNearBottom,
    escapedFromLock,
    showScrollToBottom,
    scrollToBottom,
    scrollToBottomAndResume,
    stopScroll,
  }
}
