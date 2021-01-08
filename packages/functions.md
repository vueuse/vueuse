
# Core Functions

<!--GENERATED LIST, DO NOT MODIFY MANUALLY-->
<!--FUNCTIONS_LIST_STARTS-->
### Animation
  - [`useInterval`](https://vitepress--vueuse.js.org/shared/useInterval/) — reactive counter increases on every interval
  - [`useIntervalFn`](https://vitepress--vueuse.js.org/shared/useIntervalFn/) — wrapper for `setInterval` with controls
  - [`useRafFn`](https://vitepress--vueuse.js.org/core/useRafFn/) — call function on every `requestAnimationFrame`
  - [`useTimeout`](https://vitepress--vueuse.js.org/shared/useTimeout/) — update value after a given time with controls
  - [`useTimeoutFn`](https://vitepress--vueuse.js.org/shared/useTimeoutFn/) — wrapper for `setTimeout` with controls
  - [`useTimestamp`](https://vitepress--vueuse.js.org/core/useTimestamp/) — reactive current timestamp
  - [`useTransition`](https://vitepress--vueuse.js.org/core/useTransition/) — transition between values

### Browser
  - [`useBrowserLocation`](https://vitepress--vueuse.js.org/core/useBrowserLocation/) — reactive browser location
  - [`useClipboard`](https://vitepress--vueuse.js.org/core/useClipboard/) — reactive [Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)
  - [`useCssVar`](https://vitepress--vueuse.js.org/core/useCssVar/) — manipulate CSS variables
  - [`useEventListener`](https://vitepress--vueuse.js.org/core/useEventListener/) — use EventListener with ease
  - [`useFavicon`](https://vitepress--vueuse.js.org/core/useFavicon/) — reactive favicon
  - [`useFullscreen`](https://vitepress--vueuse.js.org/core/useFullscreen/) — reactive [Fullscreen API](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API)
  - [`useMediaQuery`](https://vitepress--vueuse.js.org/core/useMediaQuery/) — reactive [Media Query]((https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Testing_media_queries))
  - [`usePermission`](https://vitepress--vueuse.js.org/core/usePermission/) — reactive [Permissions API](https://developer.mozilla.org/en-US/docs/Web/API/Permissions_API)
  - [`usePreferredColorScheme`](https://vitepress--vueuse.js.org/core/usePreferredColorScheme/) — reactive [prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme) media query
  - [`usePreferredDark`](https://vitepress--vueuse.js.org/core/usePreferredDark/) — reactive dark theme preference
  - [`usePreferredLanguages`](https://vitepress--vueuse.js.org/core/usePreferredLanguages/) — reactive [Navigator Languages](https://developer.mozilla.org/en-US/docs/Web/API/NavigatorLanguage/languages)
  - [`useScriptTag`](https://vitepress--vueuse.js.org/core/useScriptTag/) — script tag injecting
  - [`useShare`](https://vitepress--vueuse.js.org/core/useShare/) — reactive [Web Share API](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share)
  - [`useTitle`](https://vitepress--vueuse.js.org/core/useTitle/) — reactive document title
  - [`useUrlSearchParams`](https://vitepress--vueuse.js.org/core/useUrlSearchParams/) — reactive [URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)

### Component
  - [`tryOnMounted`](https://vitepress--vueuse.js.org/shared/tryOnMounted/) — safe `onMounted`
  - [`tryOnUnmounted`](https://vitepress--vueuse.js.org/shared/tryOnUnmounted/) — safe `onUnmounted`
  - [`useVModel`](https://vitepress--vueuse.js.org/core/useVModel/) — shorthand for v-model binding

### Misc
  - [`useEventSource`](https://vitepress--vueuse.js.org/core/useEventSource/) — an [EventSource](https://developer.mozilla.org/en-US/docs/Web/API/EventSource) or [Server-Sent-Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events) instance opens a persistent connection to an HTTP server
  - [`useWebSocket`](https://vitepress--vueuse.js.org/core/useWebSocket/) — reactive simple [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/WebSocket) client
  - [`useWebWorker`](https://vitepress--vueuse.js.org/core/useWebWorker/) — simple [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) registration and communication
  - [`useWebWorkerFn`](https://vitepress--vueuse.js.org/core/useWebWorkerFn/) — run expensive function without blocking the UI

### Sensors
  - [`onClickOutside`](https://vitepress--vueuse.js.org/core/onClickOutside/) — listen for clicks outside of an element
  - [`onStartTyping`](https://vitepress--vueuse.js.org/core/onStartTyping/) — fires when users start typing on non-editable elements
  - [`useBattery`](https://vitepress--vueuse.js.org/core/useBattery/) — reactive [Battery Status API](https://developer.mozilla.org/en-US/docs/Web/API/Battery_Status_API)
  - [`useDeviceLight`](https://vitepress--vueuse.js.org/core/useDeviceLight/) — reactive [DeviceLightEvent](https://developer.mozilla.org/en-US/docs/Web/API/DeviceLightEvent)
  - [`useDeviceMotion`](https://vitepress--vueuse.js.org/core/useDeviceMotion/) — reactive [DeviceMotionEvent](https://developer.mozilla.org/en-US/docs/Web/API/DeviceMotionEvent)
  - [`useDeviceOrientation`](https://vitepress--vueuse.js.org/core/useDeviceOrientation/) — reactive [DeviceOrientationEvent](https://developer.mozilla.org/en-US/docs/Web/API/DeviceOrientationEvent)
  - [`useDevicePixelRatio`](https://vitepress--vueuse.js.org/core/useDevicePixelRatio/) — reactively track [`window.devicePixelRatio`](https://developer.mozilla.org/ru/docs/Web/API/Window/devicePixelRatio)
  - [`useDocumentVisibility`](https://vitepress--vueuse.js.org/core/useDocumentVisibility/) — reactively track [`document.visibilityState`](https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilityState)
  - [`useElementBounding`](https://vitepress--vueuse.js.org/core/useElementBounding/) — reactive [bounding box](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect) of an HTML element
  - [`useElementSize`](https://vitepress--vueuse.js.org/core/useElementSize/) — reactive size of an HTML element
  - [`useElementVisibility`](https://vitepress--vueuse.js.org/core/useElementVisibility/) — tracks the visibility of an element within the viewport
  - [`useGeolocation`](https://vitepress--vueuse.js.org/core/useGeolocation/) — reactive [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)
  - [`useIdle`](https://vitepress--vueuse.js.org/core/useIdle/) — tracks whether the user is being inactive
  - [`useIntersectionObserver`](https://vitepress--vueuse.js.org/core/useIntersectionObserver/) — detects that a target element's visibility
  - [`useMouse`](https://vitepress--vueuse.js.org/core/useMouse/) — reactive mouse position
  - [`useMouseInElement`](https://vitepress--vueuse.js.org/core/useMouseInElement/) — reactive mouse position related to an element
  - [`useMousePressed`](https://vitepress--vueuse.js.org/core/useMousePressed/) — reactive mouse pressing state
  - [`useMutationObserver`](https://vitepress--vueuse.js.org/core/useMutationObserver/) — watch for changes being made to the DOM tree
  - [`useNetwork`](https://vitepress--vueuse.js.org/core/useNetwork/) — reactive [Network status](https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API)
  - [`useOnline`](https://vitepress--vueuse.js.org/core/useOnline/) — reactive online state
  - [`usePageLeave`](https://vitepress--vueuse.js.org/core/usePageLeave/) — reactive state to show whether the mouse leaves the page
  - [`useParallax`](https://vitepress--vueuse.js.org/core/useParallax/) — create parallax effect easily
  - [`useResizeObserver`](https://vitepress--vueuse.js.org/core/useResizeObserver/) — reports changes to the dimensions of an Element's content or the border-box
  - [`useSpeechRecognition`](https://vitepress--vueuse.js.org/core/useSpeechRecognition/) — reactive [SpeechRecognition](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition)
  - [`useWindowScroll`](https://vitepress--vueuse.js.org/core/useWindowScroll/) — reactive window scroll
  - [`useWindowSize`](https://vitepress--vueuse.js.org/core/useWindowSize/) — reactive window size

### State
  - [`createGlobalState`](https://vitepress--vueuse.js.org/core/createGlobalState/) — keep states in the global scope to be reusable across Vue instances
  - [`useLocalStorage`](https://vitepress--vueuse.js.org/core/useLocalStorage/) — reactive [LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
  - [`useSessionStorage`](https://vitepress--vueuse.js.org/core/useSessionStorage/) — reactive [SessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)
  - [`useStorage`](https://vitepress--vueuse.js.org/core/useStorage/) — reactive [LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)/[SessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)

### Utilities
  - [`asyncComputed`](https://vitepress--vueuse.js.org/core/asyncComputed/) — computed for async functions
  - [`biSyncRef`](https://vitepress--vueuse.js.org/shared/biSyncRef/) — two-way refs synchronization
  - [`controlledComputed`](https://vitepress--vueuse.js.org/shared/controlledComputed/) — explicitly define the deps of computed
  - [`extendRef`](https://vitepress--vueuse.js.org/shared/extendRef/) — add extra attributes to Ref
  - [`get`](https://vitepress--vueuse.js.org/shared/get/) — shorthand for accessing `ref.value`
  - [`makeDestructurable`](https://vitepress--vueuse.js.org/shared/makeDestructurable/) — make isomorphic destructurable for object and array at the same time
  - [`reactify`](https://vitepress--vueuse.js.org/shared/reactify/) — converts plain function into a reactive function
  - [`reactifyObject`](https://vitepress--vueuse.js.org/shared/reactifyObject/) — apply `reactify` to an object
  - [`set`](https://vitepress--vueuse.js.org/shared/set/) — shorthand for `ref.value = x`
  - [`syncRef`](https://vitepress--vueuse.js.org/shared/syncRef/) — keep target refs in sync with a source ref
  - [`useAsyncState`](https://vitepress--vueuse.js.org/core/useAsyncState/) — reactive async state
  - [`useCounter`](https://vitepress--vueuse.js.org/shared/useCounter/) — basic counter with utility functions
  - [`useDebounce`](https://vitepress--vueuse.js.org/shared/useDebounce/) — debounce execution of a ref value
  - [`useDebounceFn`](https://vitepress--vueuse.js.org/shared/useDebounceFn/) — debounce execution of a function
  - [`useManualRefHistory`](https://vitepress--vueuse.js.org/core/useManualRefHistory/) — manually track the change history of a ref when the using calls `commit()`
  - [`useRefHistory`](https://vitepress--vueuse.js.org/core/useRefHistory/) — track the change history of a ref
  - [`useThrottle`](https://vitepress--vueuse.js.org/shared/useThrottle/) — throttle changing of a ref value
  - [`useThrottleFn`](https://vitepress--vueuse.js.org/shared/useThrottleFn/) — throttle execution of a function
  - [`useToggle`](https://vitepress--vueuse.js.org/shared/useToggle/) — a boolean switcher with utility functions

### Watch
  - [`debouncedWatch`](https://vitepress--vueuse.js.org/shared/debouncedWatch/) — debounced watch
  - [`ignorableWatch`](https://vitepress--vueuse.js.org/shared/ignorableWatch/) — ignorable watch
  - [`pausableWatch`](https://vitepress--vueuse.js.org/shared/pausableWatch/) — pausable watch
  - [`throttledWatch`](https://vitepress--vueuse.js.org/shared/throttledWatch/) — throttled watch
  - [`watchWithFilter`](https://vitepress--vueuse.js.org/shared/watchWithFilter/) — `watch` with additional EventFilter control
  - [`when`](https://vitepress--vueuse.js.org/shared/when/) — promised one-time watch for ref changes


<!--FUNCTIONS_LIST_ENDS-->

More functions to be added. Please stay tuned. (PRs are also welcome!)

Meanwhile, try also [**vue-composable**](https://github.com/pikax/vue-composable) by [@pikax](https://github.com/pikax)!

# Add-ons

The core package aims to be lightweight and dependence free. While the add-ons are wrapping popular packages into the consistent API style.

<!--GENERATED LIST, DO NOT MODIFY MANUALLY-->
<!--ADDONS_LIST_STARTS-->

### Router ([`@vueuse/router`](https://vitepress--vueuse.js.org/router/README.html))
Utilities for vue-router
  - [`useRouteHash`](https://vitepress--vueuse.js.org/router/useRouteHash/) — shorthand for reactive route.hash
  - [`useRouteQuery`](https://vitepress--vueuse.js.org/router/useRouteQuery/) — shorthand for reactive route.query



### Integrations ([`@vueuse/integrations`](https://vitepress--vueuse.js.org/integrations/README.html))
Integration wrappers for utility libraries
  - [`useAxios`](https://vitepress--vueuse.js.org/integrations/useAxios/) — wrapper for [`axios`](https://github.com/axios/axios)
  - [`useCookies`](https://vitepress--vueuse.js.org/integrations/useCookies/) — wrapper for [`universal-cookie`](https://www.npmjs.com/package/universal-cookie)
  - [`useNProgress`](https://vitepress--vueuse.js.org/integrations/useNProgress/) — reactive wrapper for [`nprogress`](https://github.com/rstacruz/nprogress)
  - [`useQRCode`](https://vitepress--vueuse.js.org/integrations/useQRCode/) — wrapper for [`qrcode`](https://github.com/soldair/node-qrcode)



### RxJS ([`@vueuse/rxjs`](https://vitepress--vueuse.js.org/rxjs/README.html))
Enables RxJS reactive functions in Vue
  - [`from`](https://vitepress--vueuse.js.org/rxjs/from/) — two wrappers around of the original functions to allow use ref objects
  - [`toObserver`](https://vitepress--vueuse.js.org/rxjs/toObserver/) — sugar function to convert a ref in an observer
  - [`useObservable`](https://vitepress--vueuse.js.org/rxjs/useObservable/) — use an Observable
  - [`useSubscription`](https://vitepress--vueuse.js.org/rxjs/useSubscription/) — uses subscriptions without worry about unsubscribing to it or memory leaks



### Firebase ([`@vueuse/firebase`](https://vitepress--vueuse.js.org/firebase/README.html))
Enables realtime bindings for Firebase
  - [`useFirestore`](https://vitepress--vueuse.js.org/firebase/useFirestore/) — reactive [Firestore](https://firebase.google.com/docs/firestore) binding
  - [`useRTDB`](https://vitepress--vueuse.js.org/firebase/useRTDB/) — reactive [Firebase Realtime Database](https://firebase.google.com/docs/database) binding


<!--ADDONS_LIST_ENDS-->

