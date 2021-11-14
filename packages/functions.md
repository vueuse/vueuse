::: tip
📰 [Recently updated functions](/recently-updated)
:::

# Core Functions

<!--GENERATED LIST, DO NOT MODIFY MANUALLY-->
<!--FUNCTIONS_LIST_STARTS-->
### Animation
  - [`useInterval`](https://vueuse.org/shared/useInterval/) — reactive counter increases on every interval
  - [`useIntervalFn`](https://vueuse.org/shared/useIntervalFn/) — wrapper for `setInterval` with controls
  - [`useNow`](https://vueuse.org/core/useNow/) — reactive current Date instance
  - [`useRafFn`](https://vueuse.org/core/useRafFn/) — call function on every `requestAnimationFrame`
  - [`useTimeout`](https://vueuse.org/shared/useTimeout/) — update value after a given time with controls
  - [`useTimeoutFn`](https://vueuse.org/shared/useTimeoutFn/) — wrapper for `setTimeout` with controls
  - [`useTimestamp`](https://vueuse.org/core/useTimestamp/) — reactive current timestamp
  - [`useTransition`](https://vueuse.org/core/useTransition/) — transition between values

### Browser
  - [`useActiveElement`](https://vueuse.org/core/useActiveElement/) — reactive `document.activeElement`
  - [`useBreakpoints`](https://vueuse.org/core/useBreakpoints/) — reactive viewport breakpoints
  - [`useBrowserLocation`](https://vueuse.org/core/useBrowserLocation/) — reactive browser location
  - [`useClipboard`](https://vueuse.org/core/useClipboard/) — reactive [Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)
  - [`useCssVar`](https://vueuse.org/core/useCssVar/) — manipulate CSS variables
  - [`useDark`](https://vueuse.org/core/useDark/) — reactive dark mode with auto data persistence
  - [`useEventListener`](https://vueuse.org/core/useEventListener/) — use EventListener with ease
  - [`useEyeDropper`](https://vueuse.org/core/useEyeDropper/) — reactive [EyeDropper API](https://developer.mozilla.org/en-US/docs/Web/API/EyeDropper_API)
  - [`useFavicon`](https://vueuse.org/core/useFavicon/) — reactive favicon
  - [`useFetch`](https://vueuse.org/core/useFetch/) — reactive [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) provides the ability to abort requests
  - [`useFullscreen`](https://vueuse.org/core/useFullscreen/) — reactive [Fullscreen API](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API)
  - [`useMediaControls`](https://vueuse.org/core/useMediaControls/) — reactive media controls for both `audio` and `video` elements
  - [`useMediaQuery`](https://vueuse.org/core/useMediaQuery/) — reactive [Media Query](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Testing_media_queries)
  - [`usePermission`](https://vueuse.org/core/usePermission/) — reactive [Permissions API](https://developer.mozilla.org/en-US/docs/Web/API/Permissions_API)
  - [`usePreferredColorScheme`](https://vueuse.org/core/usePreferredColorScheme/) — reactive [prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme) media query
  - [`usePreferredDark`](https://vueuse.org/core/usePreferredDark/) — reactive dark theme preference
  - [`usePreferredLanguages`](https://vueuse.org/core/usePreferredLanguages/) — reactive [Navigator Languages](https://developer.mozilla.org/en-US/docs/Web/API/NavigatorLanguage/languages)
  - [`useScriptTag`](https://vueuse.org/core/useScriptTag/) — script tag injecting
  - [`useShare`](https://vueuse.org/core/useShare/) — reactive [Web Share API](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share)
  - [`useTitle`](https://vueuse.org/core/useTitle/) — reactive document title
  - [`useUrlSearchParams`](https://vueuse.org/core/useUrlSearchParams/) — reactive [URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)
  - [`useWakeLock`](https://vueuse.org/core/useWakeLock/) — reactive [Screen Wake Lock API](https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API) provides a way to prevent devices from dimming or locking the screen when an application needs to keep running

### Component
  - [`computedInject`](https://vueuse.org/core/computedInject/) — combine computed and inject
  - [`templateRef`](https://vueuse.org/core/templateRef/) — shorthand for binding ref to template element
  - [`tryOnBeforeUnmount`](https://vueuse.org/shared/tryOnBeforeUnmount/) — safe `onBeforeUnmount`
  - [`tryOnMounted`](https://vueuse.org/shared/tryOnMounted/) — safe `onMounted`
  - [`tryOnScopeDispose`](https://vueuse.org/shared/tryOnScopeDispose/) — safe `onScopeDispose`
  - [`tryOnUnmounted`](https://vueuse.org/shared/tryOnUnmounted/) — safe `onUnmounted`
  - [`unrefElement`](https://vueuse.org/core/unrefElement/) — unref for dom element
  - [`useTemplateRefsList`](https://vueuse.org/core/useTemplateRefsList/) — shorthand for binding refs to template elements and components inside `v-for`
  - [`useVirtualList`](https://vueuse.org/core/useVirtualList/) — create virtual lists with ease
  - [`useVModel`](https://vueuse.org/core/useVModel/) — shorthand for v-model binding
  - [`useVModels`](https://vueuse.org/core/useVModels/) — shorthand for props v-model binding

### Formatters
  - [`useTimeAgo`](https://vueuse.org/core/useTimeAgo/) — reactive time ago

### Misc
  - [`useEventSource`](https://vueuse.org/core/useEventSource/) — an [EventSource](https://developer.mozilla.org/en-US/docs/Web/API/EventSource) or [Server-Sent-Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events) instance opens a persistent connection to an HTTP server
  - [`useWebSocket`](https://vueuse.org/core/useWebSocket/) — reactive [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/WebSocket) client
  - [`useWebWorker`](https://vueuse.org/core/useWebWorker/) — simple [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) registration and communication
  - [`useWebWorkerFn`](https://vueuse.org/core/useWebWorkerFn/) — run expensive function without blocking the UI

### Sensors
  - [`onClickOutside`](https://vueuse.org/core/onClickOutside/) — listen for clicks outside of an element
  - [`onKeyStroke`](https://vueuse.org/core/onKeyStroke/) — listen for keyboard key being stroked
  - [`onStartTyping`](https://vueuse.org/core/onStartTyping/) — fires when users start typing on non-editable elements
  - [`useBattery`](https://vueuse.org/core/useBattery/) — reactive [Battery Status API](https://developer.mozilla.org/en-US/docs/Web/API/Battery_Status_API)
  - [`useDeviceMotion`](https://vueuse.org/core/useDeviceMotion/) — reactive [DeviceMotionEvent](https://developer.mozilla.org/en-US/docs/Web/API/DeviceMotionEvent)
  - [`useDeviceOrientation`](https://vueuse.org/core/useDeviceOrientation/) — reactive [DeviceOrientationEvent](https://developer.mozilla.org/en-US/docs/Web/API/DeviceOrientationEvent)
  - [`useDevicePixelRatio`](https://vueuse.org/core/useDevicePixelRatio/) — reactively track [`window.devicePixelRatio`](https://developer.mozilla.org/ru/docs/Web/API/Window/devicePixelRatio)
  - [`useDevicesList`](https://vueuse.org/core/useDevicesList/) — reactive [enumerateDevices](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/enumerateDevices) listing avaliable input/output devices
  - [`useDisplayMedia`](https://vueuse.org/core/useDisplayMedia/) — reactive [`mediaDevices.getDisplayMedia`](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getDisplayMedia) streaming
  - [`useDocumentVisibility`](https://vueuse.org/core/useDocumentVisibility/) — reactively track [`document.visibilityState`](https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilityState)
  - [`useDraggable`](https://vueuse.org/core/useDraggable/) — make elements draggable
  - [`useElementBounding`](https://vueuse.org/core/useElementBounding/) — reactive [bounding box](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect) of an HTML element
  - [`useElementHover`](https://vueuse.org/core/useElementHover/) — reactive element's hover state
  - [`useElementSize`](https://vueuse.org/core/useElementSize/) — reactive size of an HTML element
  - [`useElementVisibility`](https://vueuse.org/core/useElementVisibility/) — tracks the visibility of an element within the viewport
  - [`useFps`](https://vueuse.org/core/useFps/) — reactive FPS (frames per second)
  - [`useGeolocation`](https://vueuse.org/core/useGeolocation/) — reactive [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)
  - [`useIdle`](https://vueuse.org/core/useIdle/) — tracks whether the user is being inactive
  - [`useIntersectionObserver`](https://vueuse.org/core/useIntersectionObserver/) — detects that a target element's visibility
  - [`useKeyModifier`](https://vueuse.org/core/useKeyModifier/) — reactive [Modifier State](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/getModifierState)
  - [`useMagicKeys`](https://vueuse.org/core/useMagicKeys/) — reactive keys pressed state
  - [`useMouse`](https://vueuse.org/core/useMouse/) — reactive mouse position
  - [`useMouseInElement`](https://vueuse.org/core/useMouseInElement/) — reactive mouse position related to an element
  - [`useMousePressed`](https://vueuse.org/core/useMousePressed/) — reactive mouse pressing state
  - [`useMutationObserver`](https://vueuse.org/core/useMutationObserver/) — watch for changes being made to the DOM tree
  - [`useNetwork`](https://vueuse.org/core/useNetwork/) — reactive [Network status](https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API)
  - [`useOnline`](https://vueuse.org/core/useOnline/) — reactive online state
  - [`usePageLeave`](https://vueuse.org/core/usePageLeave/) — reactive state to show whether the mouse leaves the page
  - [`useParallax`](https://vueuse.org/core/useParallax/) — create parallax effect easily
  - [`usePointer`](https://vueuse.org/core/usePointer/) — reactive [pointer state](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events)
  - [`usePointerSwipe`](https://vueuse.org/core/usePointerSwipe/) — reactive swipe detection based on [PointerEvents](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent)
  - [`useResizeObserver`](https://vueuse.org/core/useResizeObserver/) — reports changes to the dimensions of an Element's content or the border-box
  - [`useScroll`](https://vueuse.org/core/useScroll/) — reactive scroll position and state
  - [`useSpeechRecognition`](https://vueuse.org/core/useSpeechRecognition/) — reactive [SpeechRecognition](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition)
  - [`useSpeechSynthesis`](https://vueuse.org/core/useSpeechSynthesis/) — reactive [SpeechSynthesis](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis)
  - [`useSwipe`](https://vueuse.org/core/useSwipe/) — reactive swipe detection based on [`TouchEvents`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent)
  - [`useUserMedia`](https://vueuse.org/core/useUserMedia/) — reactive [`mediaDevices.getUserMedia`](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia) streaming
  - [`useWindowFocus`](https://vueuse.org/core/useWindowFocus/) — reactively track window focus with `window.onfocus` and `window.onblur` events
  - [`useWindowScroll`](https://vueuse.org/core/useWindowScroll/) — reactive window scroll
  - [`useWindowSize`](https://vueuse.org/core/useWindowSize/) — reactive window size

### State
  - [`createGlobalState`](https://vueuse.org/shared/createGlobalState/) — keep states in the global scope to be reusable across Vue instances
  - [`createSharedComposable`](https://vueuse.org/shared/createSharedComposable/) — make a composable function usable with multiple Vue instances
  - [`useLocalStorage`](https://vueuse.org/core/useLocalStorage/) — reactive [LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
  - [`useSessionStorage`](https://vueuse.org/core/useSessionStorage/) — reactive [SessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)
  - [`useStorage`](https://vueuse.org/core/useStorage/) — reactive [LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)/[SessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)

### Utilities
  - [`and`](https://vueuse.org/shared/and/) — `AND` condition for refs
  - [`asyncComputed`](https://vueuse.org/core/asyncComputed/) — computed for async functions
  - [`autoResetRef`](https://vueuse.org/core/autoResetRef/) — a ref which will be reset to the default value after some time
  - [`biSyncRef`](https://vueuse.org/shared/biSyncRef/) — two-way refs synchronization
  - [`controlledComputed`](https://vueuse.org/shared/controlledComputed/) — explicitly define the deps of computed
  - [`controlledRef`](https://vueuse.org/shared/controlledRef/) — fine-grained controls over ref and its reactivity
  - [`createEventHook`](https://vueuse.org/shared/createEventHook/) — utility for creating event hooks
  - [`createUnrefFn`](https://vueuse.org/core/createUnrefFn/) — make a plain function accepting ref and raw values as arguments
  - [`eagerComputed`](https://vueuse.org/shared/eagerComputed/) — eager computed without lazy evaluation
  - [`extendRef`](https://vueuse.org/shared/extendRef/) — add extra attributes to Ref
  - [`get`](https://vueuse.org/shared/get/) — shorthand for accessing `ref.value`
  - [`isDefined`](https://vueuse.org/shared/isDefined/) — non-nullish checking type guard for Ref
  - [`makeDestructurable`](https://vueuse.org/shared/makeDestructurable/) — make isomorphic destructurable for object and array at the same time
  - [`not`](https://vueuse.org/shared/not/) — `NOT` condition for ref
  - [`or`](https://vueuse.org/shared/or/) — `OR` conditions for refs
  - [`reactify`](https://vueuse.org/shared/reactify/) — converts plain functions into reactive functions
  - [`reactifyObject`](https://vueuse.org/shared/reactifyObject/) — apply `reactify` to an object
  - [`reactivePick`](https://vueuse.org/shared/reactivePick/) — reactively pick fields from a reactive object
  - [`refDefault`](https://vueuse.org/shared/refDefault/) — apply default value to a ref
  - [`set`](https://vueuse.org/shared/set/) — shorthand for `ref.value = x`
  - [`syncRef`](https://vueuse.org/shared/syncRef/) — keep target refs in sync with a source ref
  - [`toReactive`](https://vueuse.org/shared/toReactive/) — converts ref to reactive
  - [`toRefs`](https://vueuse.org/shared/toRefs/) — extended [`toRefs`](https://v3.vuejs.org/api/refs-api.html#torefs) that also accepts refs of an object
  - [`useAsyncState`](https://vueuse.org/core/useAsyncState/) — reactive async state
  - [`useBase64`](https://vueuse.org/core/useBase64/) — reactive base64 transforming
  - [`useConfirmDialog`](https://vueuse.org/core/useConfirmDialog/) — creates event hooks to support modals and confirmation dialog chains
  - [`useCounter`](https://vueuse.org/shared/useCounter/) — basic counter with utility functions
  - [`useDebounce`](https://vueuse.org/shared/useDebounce/) — debounce execution of a ref value
  - [`useDebouncedRefHistory`](https://vueuse.org/core/useDebouncedRefHistory/) — shorthand for `useRefHistory` with debounced filter
  - [`useDebounceFn`](https://vueuse.org/shared/useDebounceFn/) — debounce execution of a function
  - [`useEventBus`](https://vueuse.org/core/useEventBus/) — a basic event bus
  - [`useLastChanged`](https://vueuse.org/shared/useLastChanged/) — records the timestamp of the last change
  - [`useManualRefHistory`](https://vueuse.org/core/useManualRefHistory/) — manually track the change history of a ref when the using calls `commit()`
  - [`useRefHistory`](https://vueuse.org/core/useRefHistory/) — track the change history of a ref
  - [`useThrottle`](https://vueuse.org/shared/useThrottle/) — throttle changing of a ref value
  - [`useThrottledRefHistory`](https://vueuse.org/core/useThrottledRefHistory/) — shorthand for `useRefHistory` with throttled filter
  - [`useThrottleFn`](https://vueuse.org/shared/useThrottleFn/) — throttle execution of a function
  - [`useToggle`](https://vueuse.org/shared/useToggle/) — a boolean switcher with utility functions

### Watch
  - [`debouncedWatch`](https://vueuse.org/shared/debouncedWatch/) — debounced watch
  - [`ignorableWatch`](https://vueuse.org/shared/ignorableWatch/) — ignorable watch
  - [`pausableWatch`](https://vueuse.org/shared/pausableWatch/) — pausable watch
  - [`throttledWatch`](https://vueuse.org/shared/throttledWatch/) — throttled watch
  - [`until`](https://vueuse.org/shared/until/) — promised one-time watch for changes
  - [`watchAtMost`](https://vueuse.org/shared/watchAtMost/) — `watch` with the number of times triggered
  - [`watchOnce`](https://vueuse.org/shared/watchOnce/) — `watch` that only triggers once
  - [`watchWithFilter`](https://vueuse.org/shared/watchWithFilter/) — `watch` with additional EventFilter control
  - [`whenever`](https://vueuse.org/shared/whenever/) — shorthand for watching value to be truthy


<!--FUNCTIONS_LIST_ENDS-->

<br>

More functions avaliable in [Add-ons](./add-ons).
