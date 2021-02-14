# Core Functions

<!--GENERATED LIST, DO NOT MODIFY MANUALLY-->
<!--FUNCTIONS_LIST_STARTS-->
### Animation
  - [`useInterval`](https://vueuse.js.org/shared/useInterval/) — reactive counter increases on every interval
  - [`useIntervalFn`](https://vueuse.js.org/shared/useIntervalFn/) — wrapper for `setInterval` with controls
  - [`useRafFn`](https://vueuse.js.org/core/useRafFn/) — call function on every `requestAnimationFrame`
  - [`useTimeout`](https://vueuse.js.org/shared/useTimeout/) — update value after a given time with controls
  - [`useTimeoutFn`](https://vueuse.js.org/shared/useTimeoutFn/) — wrapper for `setTimeout` with controls
  - [`useTimestamp`](https://vueuse.js.org/core/useTimestamp/) — reactive current timestamp
  - [`useTransition`](https://vueuse.js.org/core/useTransition/) — transition between values

### Browser
  - [`useBrowserLocation`](https://vueuse.js.org/core/useBrowserLocation/) — reactive browser location
  - [`useClipboard`](https://vueuse.js.org/core/useClipboard/) — reactive [Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)
  - [`useCssVar`](https://vueuse.js.org/core/useCssVar/) — manipulate CSS variables
  - [`useDark`](https://vueuse.js.org/core/useDark/) — reactive dark mode with auto data persistence
  - [`useEventListener`](https://vueuse.js.org/core/useEventListener/) — use EventListener with ease
  - [`useFavicon`](https://vueuse.js.org/core/useFavicon/) — reactive favicon
  - [`useFullscreen`](https://vueuse.js.org/core/useFullscreen/) — reactive [Fullscreen API](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API)
  - [`useMediaQuery`](https://vueuse.js.org/core/useMediaQuery/) — reactive [Media Query](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Testing_media_queries)
  - [`usePermission`](https://vueuse.js.org/core/usePermission/) — reactive [Permissions API](https://developer.mozilla.org/en-US/docs/Web/API/Permissions_API)
  - [`usePreferredColorScheme`](https://vueuse.js.org/core/usePreferredColorScheme/) — reactive [prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme) media query
  - [`usePreferredDark`](https://vueuse.js.org/core/usePreferredDark/) — reactive dark theme preference
  - [`usePreferredLanguages`](https://vueuse.js.org/core/usePreferredLanguages/) — reactive [Navigator Languages](https://developer.mozilla.org/en-US/docs/Web/API/NavigatorLanguage/languages)
  - [`useScriptTag`](https://vueuse.js.org/core/useScriptTag/) — script tag injecting
  - [`useShare`](https://vueuse.js.org/core/useShare/) — reactive [Web Share API](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share)
  - [`useTitle`](https://vueuse.js.org/core/useTitle/) — reactive document title
  - [`useUrlSearchParams`](https://vueuse.js.org/core/useUrlSearchParams/) — reactive [URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)

### Component
  - [`templateRef`](https://vueuse.js.org/core/templateRef/) — shorthand for binding ref to template element
  - [`tryOnMounted`](https://vueuse.js.org/shared/tryOnMounted/) — safe `onMounted`
  - [`tryOnUnmounted`](https://vueuse.js.org/shared/tryOnUnmounted/) — safe `onUnmounted`
  - [`unrefElement`](https://vueuse.js.org/core/unrefElement/) — unref for dom element
  - [`useVModel`](https://vueuse.js.org/core/useVModel/) — shorthand for v-model binding

### Misc
  - [`useEventSource`](https://vueuse.js.org/core/useEventSource/) — an [EventSource](https://developer.mozilla.org/en-US/docs/Web/API/EventSource) or [Server-Sent-Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events) instance opens a persistent connection to an HTTP server
  - [`useWebSocket`](https://vueuse.js.org/core/useWebSocket/) — reactive simple [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/WebSocket) client
  - [`useWebWorker`](https://vueuse.js.org/core/useWebWorker/) — simple [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) registration and communication
  - [`useWebWorkerFn`](https://vueuse.js.org/core/useWebWorkerFn/) — run expensive function without blocking the UI

### Sensors
  - [`onClickOutside`](https://vueuse.js.org/core/onClickOutside/) — listen for clicks outside of an element
  - [`onStartTyping`](https://vueuse.js.org/core/onStartTyping/) — fires when users start typing on non-editable elements
  - [`useBattery`](https://vueuse.js.org/core/useBattery/) — reactive [Battery Status API](https://developer.mozilla.org/en-US/docs/Web/API/Battery_Status_API)
  - [`useDeviceLight`](https://vueuse.js.org/core/useDeviceLight/) — reactive [DeviceLightEvent](https://developer.mozilla.org/en-US/docs/Web/API/DeviceLightEvent)
  - [`useDeviceMotion`](https://vueuse.js.org/core/useDeviceMotion/) — reactive [DeviceMotionEvent](https://developer.mozilla.org/en-US/docs/Web/API/DeviceMotionEvent)
  - [`useDeviceOrientation`](https://vueuse.js.org/core/useDeviceOrientation/) — reactive [DeviceOrientationEvent](https://developer.mozilla.org/en-US/docs/Web/API/DeviceOrientationEvent)
  - [`useDevicePixelRatio`](https://vueuse.js.org/core/useDevicePixelRatio/) — reactively track [`window.devicePixelRatio`](https://developer.mozilla.org/ru/docs/Web/API/Window/devicePixelRatio)
  - [`useDocumentVisibility`](https://vueuse.js.org/core/useDocumentVisibility/) — reactively track [`document.visibilityState`](https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilityState)
  - [`useElementBounding`](https://vueuse.js.org/core/useElementBounding/) — reactive [bounding box](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect) of an HTML element
  - [`useElementSize`](https://vueuse.js.org/core/useElementSize/) — reactive size of an HTML element
  - [`useElementVisibility`](https://vueuse.js.org/core/useElementVisibility/) — tracks the visibility of an element within the viewport
  - [`useGeolocation`](https://vueuse.js.org/core/useGeolocation/) — reactive [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)
  - [`useIdle`](https://vueuse.js.org/core/useIdle/) — tracks whether the user is being inactive
  - [`useIntersectionObserver`](https://vueuse.js.org/core/useIntersectionObserver/) — detects that a target element's visibility
  - [`useMouse`](https://vueuse.js.org/core/useMouse/) — reactive mouse position
  - [`useMouseInElement`](https://vueuse.js.org/core/useMouseInElement/) — reactive mouse position related to an element
  - [`useMousePressed`](https://vueuse.js.org/core/useMousePressed/) — reactive mouse pressing state
  - [`useMutationObserver`](https://vueuse.js.org/core/useMutationObserver/) — watch for changes being made to the DOM tree
  - [`useNetwork`](https://vueuse.js.org/core/useNetwork/) — reactive [Network status](https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API)
  - [`useOnline`](https://vueuse.js.org/core/useOnline/) — reactive online state
  - [`usePageLeave`](https://vueuse.js.org/core/usePageLeave/) — reactive state to show whether the mouse leaves the page
  - [`useParallax`](https://vueuse.js.org/core/useParallax/) — create parallax effect easily
  - [`useResizeObserver`](https://vueuse.js.org/core/useResizeObserver/) — reports changes to the dimensions of an Element's content or the border-box
  - [`useSpeechRecognition`](https://vueuse.js.org/core/useSpeechRecognition/) — reactive [SpeechRecognition](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition)
  - [`useSwipe`](https://vueuse.js.org/core/useSwipe/) — reactive swipe detection based on [`TouchEvents`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent)
  - [`useWindowScroll`](https://vueuse.js.org/core/useWindowScroll/) — reactive window scroll
  - [`useWindowSize`](https://vueuse.js.org/core/useWindowSize/) — reactive window size

### State
  - [`createGlobalState`](https://vueuse.js.org/core/createGlobalState/) — keep states in the global scope to be reusable across Vue instances
  - [`useLocalStorage`](https://vueuse.js.org/core/useLocalStorage/) — reactive [LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
  - [`useSessionStorage`](https://vueuse.js.org/core/useSessionStorage/) — reactive [SessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)
  - [`useStorage`](https://vueuse.js.org/core/useStorage/) — reactive [LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)/[SessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)

### Utilities
  - [`asyncComputed`](https://vueuse.js.org/core/asyncComputed/) — computed for async functions
  - [`biSyncRef`](https://vueuse.js.org/shared/biSyncRef/) — two-way refs synchronization
  - [`controlledComputed`](https://vueuse.js.org/shared/controlledComputed/) — explicitly define the deps of computed
  - [`controlledRef`](https://vueuse.js.org/shared/controlledRef/) — fine-grained controls over ref and its reactivity
  - [`extendRef`](https://vueuse.js.org/shared/extendRef/) — add extra attributes to Ref
  - [`get`](https://vueuse.js.org/shared/get/) — shorthand for accessing `ref.value`
  - [`makeDestructurable`](https://vueuse.js.org/shared/makeDestructurable/) — make isomorphic destructurable for object and array at the same time
  - [`reactify`](https://vueuse.js.org/shared/reactify/) — converts plain functions into reactive functions
  - [`reactifyObject`](https://vueuse.js.org/shared/reactifyObject/) — apply `reactify` to an object
  - [`set`](https://vueuse.js.org/shared/set/) — shorthand for `ref.value = x`
  - [`syncRef`](https://vueuse.js.org/shared/syncRef/) — keep target refs in sync with a source ref
  - [`useAsyncState`](https://vueuse.js.org/core/useAsyncState/) — reactive async state
  - [`useCounter`](https://vueuse.js.org/shared/useCounter/) — basic counter with utility functions
  - [`useDebounce`](https://vueuse.js.org/shared/useDebounce/) — debounce execution of a ref value
  - [`useDebounceFn`](https://vueuse.js.org/shared/useDebounceFn/) — debounce execution of a function
  - [`useManualRefHistory`](https://vueuse.js.org/core/useManualRefHistory/) — manually track the change history of a ref when the using calls `commit()`
  - [`useRefHistory`](https://vueuse.js.org/core/useRefHistory/) — track the change history of a ref
  - [`useThrottle`](https://vueuse.js.org/shared/useThrottle/) — throttle changing of a ref value
  - [`useThrottleFn`](https://vueuse.js.org/shared/useThrottleFn/) — throttle execution of a function
  - [`useToggle`](https://vueuse.js.org/shared/useToggle/) — a boolean switcher with utility functions

### Watch
  - [`debouncedWatch`](https://vueuse.js.org/shared/debouncedWatch/) — debounced watch
  - [`ignorableWatch`](https://vueuse.js.org/shared/ignorableWatch/) — ignorable watch
  - [`pausableWatch`](https://vueuse.js.org/shared/pausableWatch/) — pausable watch
  - [`throttledWatch`](https://vueuse.js.org/shared/throttledWatch/) — throttled watch
  - [`watchWithFilter`](https://vueuse.js.org/shared/watchWithFilter/) — `watch` with additional EventFilter control
  - [`when`](https://vueuse.js.org/shared/when/) — promised one-time watch for ref changes


<!--FUNCTIONS_LIST_ENDS-->

<br>

More functions avaliable in [Add-ons](./add-ons).
