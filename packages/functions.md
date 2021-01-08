
# Core Functions

<!--GENERATED LIST, DO NOT MODIFY MANUALLY-->
<!--FUNCTIONS_LIST_STARTS-->
### Animation
  - [`useInterval`](https://vitepress--vueuse..netlify.app/shared/useInterval/) — reactive counter increases on every interval
  - [`useIntervalFn`](https://vitepress--vueuse..netlify.app/shared/useIntervalFn/) — wrapper for `setInterval` with controls
  - [`useRafFn`](https://vitepress--vueuse..netlify.app/core/useRafFn/) — call function on every `requestAnimationFrame`
  - [`useTimeout`](https://vitepress--vueuse..netlify.app/shared/useTimeout/) — update value after a given time with controls
  - [`useTimeoutFn`](https://vitepress--vueuse..netlify.app/shared/useTimeoutFn/) — wrapper for `setTimeout` with controls
  - [`useTimestamp`](https://vitepress--vueuse..netlify.app/core/useTimestamp/) — reactive current timestamp
  - [`useTransition`](https://vitepress--vueuse..netlify.app/core/useTransition/) — transition between values

### Browser
  - [`useBrowserLocation`](https://vitepress--vueuse..netlify.app/core/useBrowserLocation/) — reactive browser location
  - [`useClipboard`](https://vitepress--vueuse..netlify.app/core/useClipboard/) — reactive [Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)
  - [`useCssVar`](https://vitepress--vueuse..netlify.app/core/useCssVar/) — manipulate CSS variables
  - [`useEventListener`](https://vitepress--vueuse..netlify.app/core/useEventListener/) — use EventListener with ease
  - [`useFavicon`](https://vitepress--vueuse..netlify.app/core/useFavicon/) — reactive favicon
  - [`useFullscreen`](https://vitepress--vueuse..netlify.app/core/useFullscreen/) — reactive [Fullscreen API](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API)
  - [`useMediaQuery`](https://vitepress--vueuse..netlify.app/core/useMediaQuery/) — reactive [Media Query]((https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Testing_media_queries))
  - [`usePermission`](https://vitepress--vueuse..netlify.app/core/usePermission/) — reactive [Permissions API](https://developer.mozilla.org/en-US/docs/Web/API/Permissions_API)
  - [`usePreferredColorScheme`](https://vitepress--vueuse..netlify.app/core/usePreferredColorScheme/) — reactive [prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme) media query
  - [`usePreferredDark`](https://vitepress--vueuse..netlify.app/core/usePreferredDark/) — reactive dark theme preference
  - [`usePreferredLanguages`](https://vitepress--vueuse..netlify.app/core/usePreferredLanguages/) — reactive [Navigator Languages](https://developer.mozilla.org/en-US/docs/Web/API/NavigatorLanguage/languages)
  - [`useScriptTag`](https://vitepress--vueuse..netlify.app/core/useScriptTag/) — script tag injecting
  - [`useShare`](https://vitepress--vueuse..netlify.app/core/useShare/) — reactive [Web Share API](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share)
  - [`useTitle`](https://vitepress--vueuse..netlify.app/core/useTitle/) — reactive document title
  - [`useUrlSearchParams`](https://vitepress--vueuse..netlify.app/core/useUrlSearchParams/) — reactive [URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)

### Component
  - [`tryOnMounted`](https://vitepress--vueuse..netlify.app/shared/tryOnMounted/) — safe `onMounted`
  - [`tryOnUnmounted`](https://vitepress--vueuse..netlify.app/shared/tryOnUnmounted/) — safe `onUnmounted`
  - [`useVModel`](https://vitepress--vueuse..netlify.app/core/useVModel/) — shorthand for v-model binding

### Misc
  - [`useEventSource`](https://vitepress--vueuse..netlify.app/core/useEventSource/) — an [EventSource](https://developer.mozilla.org/en-US/docs/Web/API/EventSource) or [Server-Sent-Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events) instance opens a persistent connection to an HTTP server
  - [`useWebSocket`](https://vitepress--vueuse..netlify.app/core/useWebSocket/) — reactive simple [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/WebSocket) client
  - [`useWebWorker`](https://vitepress--vueuse..netlify.app/core/useWebWorker/) — simple [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) registration and communication
  - [`useWebWorkerFn`](https://vitepress--vueuse..netlify.app/core/useWebWorkerFn/) — run expensive function without blocking the UI

### Sensors
  - [`onClickOutside`](https://vitepress--vueuse..netlify.app/core/onClickOutside/) — listen for clicks outside of an element
  - [`onStartTyping`](https://vitepress--vueuse..netlify.app/core/onStartTyping/) — fires when users start typing on non-editable elements
  - [`useBattery`](https://vitepress--vueuse..netlify.app/core/useBattery/) — reactive [Battery Status API](https://developer.mozilla.org/en-US/docs/Web/API/Battery_Status_API)
  - [`useDeviceLight`](https://vitepress--vueuse..netlify.app/core/useDeviceLight/) — reactive [DeviceLightEvent](https://developer.mozilla.org/en-US/docs/Web/API/DeviceLightEvent)
  - [`useDeviceMotion`](https://vitepress--vueuse..netlify.app/core/useDeviceMotion/) — reactive [DeviceMotionEvent](https://developer.mozilla.org/en-US/docs/Web/API/DeviceMotionEvent)
  - [`useDeviceOrientation`](https://vitepress--vueuse..netlify.app/core/useDeviceOrientation/) — reactive [DeviceOrientationEvent](https://developer.mozilla.org/en-US/docs/Web/API/DeviceOrientationEvent)
  - [`useDevicePixelRatio`](https://vitepress--vueuse..netlify.app/core/useDevicePixelRatio/) — reactively track [`window.devicePixelRatio`](https://developer.mozilla.org/ru/docs/Web/API/Window/devicePixelRatio)
  - [`useDocumentVisibility`](https://vitepress--vueuse..netlify.app/core/useDocumentVisibility/) — reactively track [`document.visibilityState`](https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilityState)
  - [`useElementBounding`](https://vitepress--vueuse..netlify.app/core/useElementBounding/) — reactive [bounding box](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect) of an HTML element
  - [`useElementSize`](https://vitepress--vueuse..netlify.app/core/useElementSize/) — reactive size of an HTML element
  - [`useElementVisibility`](https://vitepress--vueuse..netlify.app/core/useElementVisibility/) — tracks the visibility of an element within the viewport
  - [`useGeolocation`](https://vitepress--vueuse..netlify.app/core/useGeolocation/) — reactive [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)
  - [`useIdle`](https://vitepress--vueuse..netlify.app/core/useIdle/) — tracks whether the user is being inactive
  - [`useIntersectionObserver`](https://vitepress--vueuse..netlify.app/core/useIntersectionObserver/) — detects that a target element's visibility
  - [`useMouse`](https://vitepress--vueuse..netlify.app/core/useMouse/) — reactive mouse position
  - [`useMouseInElement`](https://vitepress--vueuse..netlify.app/core/useMouseInElement/) — reactive mouse position related to an element
  - [`useMousePressed`](https://vitepress--vueuse..netlify.app/core/useMousePressed/) — reactive mouse pressing state
  - [`useMutationObserver`](https://vitepress--vueuse..netlify.app/core/useMutationObserver/) — watch for changes being made to the DOM tree
  - [`useNetwork`](https://vitepress--vueuse..netlify.app/core/useNetwork/) — reactive [Network status](https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API)
  - [`useOnline`](https://vitepress--vueuse..netlify.app/core/useOnline/) — reactive online state
  - [`usePageLeave`](https://vitepress--vueuse..netlify.app/core/usePageLeave/) — reactive state to show whether the mouse leaves the page
  - [`useParallax`](https://vitepress--vueuse..netlify.app/core/useParallax/) — create parallax effect easily
  - [`useResizeObserver`](https://vitepress--vueuse..netlify.app/core/useResizeObserver/) — reports changes to the dimensions of an Element's content or the border-box
  - [`useSpeechRecognition`](https://vitepress--vueuse..netlify.app/core/useSpeechRecognition/) — reactive [SpeechRecognition](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition)
  - [`useWindowScroll`](https://vitepress--vueuse..netlify.app/core/useWindowScroll/) — reactive window scroll
  - [`useWindowSize`](https://vitepress--vueuse..netlify.app/core/useWindowSize/) — reactive window size

### State
  - [`createGlobalState`](https://vitepress--vueuse..netlify.app/core/createGlobalState/) — keep states in the global scope to be reusable across Vue instances
  - [`useLocalStorage`](https://vitepress--vueuse..netlify.app/core/useLocalStorage/) — reactive [LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
  - [`useSessionStorage`](https://vitepress--vueuse..netlify.app/core/useSessionStorage/) — reactive [SessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)
  - [`useStorage`](https://vitepress--vueuse..netlify.app/core/useStorage/) — reactive [LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)/[SessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)

### Utilities
  - [`asyncComputed`](https://vitepress--vueuse..netlify.app/core/asyncComputed/) — computed for async functions
  - [`biSyncRef`](https://vitepress--vueuse..netlify.app/shared/biSyncRef/) — two-way refs synchronization
  - [`controlledComputed`](https://vitepress--vueuse..netlify.app/shared/controlledComputed/) — explicitly define the deps of computed
  - [`extendRef`](https://vitepress--vueuse..netlify.app/shared/extendRef/) — add extra attributes to Ref
  - [`get`](https://vitepress--vueuse..netlify.app/shared/get/) — shorthand for accessing `ref.value`
  - [`makeDestructurable`](https://vitepress--vueuse..netlify.app/shared/makeDestructurable/) — make isomorphic destructurable for object and array at the same time
  - [`reactify`](https://vitepress--vueuse..netlify.app/shared/reactify/) — converts plain function into a reactive function
  - [`reactifyObject`](https://vitepress--vueuse..netlify.app/shared/reactifyObject/) — apply `reactify` to an object
  - [`set`](https://vitepress--vueuse..netlify.app/shared/set/) — shorthand for `ref.value = x`
  - [`syncRef`](https://vitepress--vueuse..netlify.app/shared/syncRef/) — keep target refs in sync with a source ref
  - [`useAsyncState`](https://vitepress--vueuse..netlify.app/core/useAsyncState/) — reactive async state
  - [`useCounter`](https://vitepress--vueuse..netlify.app/shared/useCounter/) — basic counter with utility functions
  - [`useDebounce`](https://vitepress--vueuse..netlify.app/shared/useDebounce/) — debounce execution of a ref value
  - [`useDebounceFn`](https://vitepress--vueuse..netlify.app/shared/useDebounceFn/) — debounce execution of a function
  - [`useManualRefHistory`](https://vitepress--vueuse..netlify.app/core/useManualRefHistory/) — manually track the change history of a ref when the using calls `commit()`
  - [`useRefHistory`](https://vitepress--vueuse..netlify.app/core/useRefHistory/) — track the change history of a ref
  - [`useThrottle`](https://vitepress--vueuse..netlify.app/shared/useThrottle/) — throttle changing of a ref value
  - [`useThrottleFn`](https://vitepress--vueuse..netlify.app/shared/useThrottleFn/) — throttle execution of a function
  - [`useToggle`](https://vitepress--vueuse..netlify.app/shared/useToggle/) — a boolean switcher with utility functions

### Watch
  - [`debouncedWatch`](https://vitepress--vueuse..netlify.app/shared/debouncedWatch/) — debounced watch
  - [`ignorableWatch`](https://vitepress--vueuse..netlify.app/shared/ignorableWatch/) — ignorable watch
  - [`pausableWatch`](https://vitepress--vueuse..netlify.app/shared/pausableWatch/) — pausable watch
  - [`throttledWatch`](https://vitepress--vueuse..netlify.app/shared/throttledWatch/) — throttled watch
  - [`watchWithFilter`](https://vitepress--vueuse..netlify.app/shared/watchWithFilter/) — `watch` with additional EventFilter control
  - [`when`](https://vitepress--vueuse..netlify.app/shared/when/) — promised one-time watch for ref changes


<!--FUNCTIONS_LIST_ENDS-->

More functions to be added. Please stay tuned. (PRs are also welcome!)

Meanwhile, try also [**vue-composable**](https://github.com/pikax/vue-composable) by [@pikax](https://github.com/pikax)!

# Add-ons

The core package aims to be lightweight and dependence free. While the add-ons are wrapping popular packages into the consistent API style.

<!--GENERATED LIST, DO NOT MODIFY MANUALLY-->
<!--ADDONS_LIST_STARTS-->

### Router ([`@vueuse/router`](https://vitepress--vueuse..netlify.app/router/README.html))
Utilities for vue-router
  - [`useRouteHash`](https://vitepress--vueuse..netlify.app/router/useRouteHash/) — shorthand for reactive route.hash
  - [`useRouteQuery`](https://vitepress--vueuse..netlify.app/router/useRouteQuery/) — shorthand for reactive route.query



### Integrations ([`@vueuse/integrations`](https://vitepress--vueuse..netlify.app/integrations/README.html))
Integration wrappers for utility libraries
  - [`useAxios`](https://vitepress--vueuse..netlify.app/integrations/useAxios/) — wrapper for [`axios`](https://github.com/axios/axios)
  - [`useCookies`](https://vitepress--vueuse..netlify.app/integrations/useCookies/) — wrapper for [`universal-cookie`](https://www.npmjs.com/package/universal-cookie)
  - [`useNProgress`](https://vitepress--vueuse..netlify.app/integrations/useNProgress/) — reactive wrapper for [`nprogress`](https://github.com/rstacruz/nprogress)
  - [`useQRCode`](https://vitepress--vueuse..netlify.app/integrations/useQRCode/) — wrapper for [`qrcode`](https://github.com/soldair/node-qrcode)



### RxJS ([`@vueuse/rxjs`](https://vitepress--vueuse..netlify.app/rxjs/README.html))
Enables RxJS reactive functions in Vue
  - [`from`](https://vitepress--vueuse..netlify.app/rxjs/from/) — two wrappers around of the original functions to allow use ref objects
  - [`toObserver`](https://vitepress--vueuse..netlify.app/rxjs/toObserver/) — sugar function to convert a ref in an observer
  - [`useObservable`](https://vitepress--vueuse..netlify.app/rxjs/useObservable/) — use an Observable
  - [`useSubscription`](https://vitepress--vueuse..netlify.app/rxjs/useSubscription/) — uses subscriptions without worry about unsubscribing to it or memory leaks



### Firebase ([`@vueuse/firebase`](https://vitepress--vueuse..netlify.app/firebase/README.html))
Enables realtime bindings for Firebase
  - [`useFirestore`](https://vitepress--vueuse..netlify.app/firebase/useFirestore/) — reactive [Firestore](https://firebase.google.com/docs/firestore) binding
  - [`useRTDB`](https://vitepress--vueuse..netlify.app/firebase/useRTDB/) — reactive [Firebase Realtime Database](https://firebase.google.com/docs/database) binding


<!--ADDONS_LIST_ENDS-->

