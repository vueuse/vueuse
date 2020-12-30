<p align="center">
<a href="https://github.com/antfu/vueuse"><img src="https://raw.githubusercontent.com/antfu/vueuse/master/resources/logo-vertical.png" alt="VueUse - Collection of essential Vue Composition Utilities" width="300"></a><br>
Collection of essential Vue Composition Utilities
</p>

<p align="center">
<a href="https://www.npmjs.com/package/@vueuse/core" target="__blank"><img src="https://img.shields.io/npm/v/@vueuse/core?color=a1b858&label=" alt="NPM version"></a>&nbsp;
<a href="https://www.npmjs.com/package/@vueuse/core" target="__blank"><img alt="NPM Downloads" src="https://img.shields.io/npm/dm/@vueuse/core?color=50a36f&label="></a>&nbsp;
<a href="https://vueuse.js.org" target="__blank"><img src="https://img.shields.io/static/v1?label=&message=docs%20%26%20demos&color=1e8a7a" alt="Storybook Demos"></a>&nbsp;
<img alt="Function Count" src="https://img.shields.io/badge/-91%20functions-13708a">
<br>
<a href="https://github.com/antfu/vueuse" target="__blank"><img alt="GitHub stars" src="https://img.shields.io/github/stars/antfu/vueuse?style=social"></a>
</p>

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/antfu/static/sponsors.svg">
    <img src='https://cdn.jsdelivr.net/gh/antfu/static/sponsors.svg'>
  </a>
</p>


## 🚀 Features

- ⚡ **Fully tree shakable**: Only take what you want, [bundle size](./docs/Export-Size.md)
- 🦾 **Type Strong**: Written in [Typescript](https://www.typescriptlang.org/), with [TS Docs](https://github.com/microsoft/tsdoc)
- 🕶 **Seamless migration**: Works for **both** Vue 3 and 2
- 🔩 **Flexible**: Configurable event filters
- 🌎 **No bundler required**: Usable it via CDN
- 🔋 **SSR Friendly**
- 🎪 **Interactive docs & demos**: [Check out the Storybook!](https://vueuse.js.org)
- 🔌 **Optional [Add-ons](#-add-ons)**: Router, Firebase, RxJS, etc.

## 🦄 Usage

```ts
import { useMouse, usePreferredDark, useLocalStorage } from '@vueuse/core'

export default {
  setup() {
    // tracks mouse position
    const { x, y } = useMouse()

    // is user prefers dark theme
    const isDark = usePreferredDark()

    // persist state in localStorage
    const store = useLocalStorage(
      'my-storage', 
      {
        name: 'Apple',
        color: 'red',
      },
    )

    return { x, y, isDark, store }
  }
})
```

Refer to [functions list](#-functions) or [documentations](https://vueuse.js.org/) for more details.

## 📦 Install

> 🎩 From v4.0, it works for Vue 2 & 3 **within a single package** by the power of [vue-demi](https://github.com/antfu/vue-demi)!

```bash
npm i @vueuse/core
```

Vue 3 Demo: [Vite](https://github.com/antfu/vite-vueuse-starter), [Webpack](https://github.com/antfu/vueuse-next-example) / Vue 2 Demo: [Vue CLI](https://github.com/antfu/vueuse-vue2-example)

### CDN

```html
<script src="https://unpkg.com/@vueuse/core"></script>
```

It will be exposed to global as `window.VueUse`


## ⚡ Functions

You can check out the full documents and live demos in [Storybook](https://vueuse.js.org/).

<!--GENERATED LIST, DO NOT MODIFY MANUALLY-->
<!--FUNCTIONS_LIST_STARTS-->
- Animation
  - [`useInterval`](https://vueuse.js.org/shared/useInterval) — reactive counter increases on every interval
  - [`useIntervalFn`](https://vueuse.js.org/shared/useIntervalFn) — wrapper for `setInterval` with controls
  - [`useRafFn`](https://vueuse.js.org/core/useRafFn) — call function on every `requestAnimationFrame`
  - [`useTimeout`](https://vueuse.js.org/shared/useTimeout) — update value after a given time with controls
  - [`useTimeoutFn`](https://vueuse.js.org/shared/useTimeoutFn) — wrapper for `setTimeout` with controls
  - [`useTimestamp`](https://vueuse.js.org/core/useTimestamp) — reactive current timestamp
  - [`useTransition`](https://vueuse.js.org/core/useTransition) — transition between values

- Browser
  - [`useBrowserLocation`](https://vueuse.js.org/core/useBrowserLocation) — reactive browser location
  - [`useClipboard`](https://vueuse.js.org/core/useClipboard) — reactive [Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)
  - [`useCssVar`](https://vueuse.js.org/core/useCssVar) — manipulate CSS variables
  - [`useEventListener`](https://vueuse.js.org/core/useEventListener) — use EventListener with ease
  - [`useFavicon`](https://vueuse.js.org/core/useFavicon) — reactive favicon
  - [`useFullscreen`](https://vueuse.js.org/core/useFullscreen) — reactive [Fullscreen API](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API)
  - [`useMediaQuery`](https://vueuse.js.org/core/useMediaQuery) — reactive [Media Query]((https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Testing_media_queries))
  - [`usePermission`](https://vueuse.js.org/core/usePermission) — reactive [Permissions API](https://developer.mozilla.org/en-US/docs/Web/API/Permissions_API)
  - [`usePreferredColorScheme`](https://vueuse.js.org/core/usePreferredColorScheme) — reactive [prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme) media query
  - [`usePreferredDark`](https://vueuse.js.org/core/usePreferredDark) — reactive dark theme preference
  - [`usePreferredLanguages`](https://vueuse.js.org/core/usePreferredLanguages) — reactive [Navigator Languages](https://developer.mozilla.org/en-US/docs/Web/API/NavigatorLanguage/languages)
  - [`useShare`](https://vueuse.js.org/core/useShare) — reactive [Web Share API](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share)
  - [`useTitle`](https://vueuse.js.org/core/useTitle) — reactive document title
  - [`useUrlSearchParams`](https://vueuse.js.org/core/useUrlSearchParams) — reactive [URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)

- Component
  - [`tryOnMounted`](https://vueuse.js.org/shared/tryOnMounted) — safe `onMounted`
  - [`tryOnUnmounted`](https://vueuse.js.org/shared/tryOnUnmounted) — safe `onUnmounted`
  - [`useVModel`](https://vueuse.js.org/core/useVModel) — shorthand for v-model binding

- Misc
  - [`useEventSource`](https://vueuse.js.org/core/useEventSource) — an [EventSource](https://developer.mozilla.org/en-US/docs/Web/API/EventSource) or [Server-Sent-Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events) instance opens a persistent connection to an HTTP server
  - [`useWebSocket`](https://vueuse.js.org/core/useWebSocket) — reactive simple [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/WebSocket) client
  - [`useWebWorker`](https://vueuse.js.org/core/useWebWorker) — simple [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) registration and communication
  - [`useWebWorkerFn`](https://vueuse.js.org/core/useWebWorkerFn) — run expensive function without blocking the UI

- Sensors
  - [`onClickOutside`](https://vueuse.js.org/core/onClickOutside) — listen for clicks outside of an element
  - [`onStartTyping`](https://vueuse.js.org/core/onStartTyping) — fires when users start typing on non-editable elements
  - [`useBattery`](https://vueuse.js.org/core/useBattery) — reactive [Battery Status API](https://developer.mozilla.org/en-US/docs/Web/API/Battery_Status_API)
  - [`useDeviceLight`](https://vueuse.js.org/core/useDeviceLight) — reactive [DeviceLightEvent](https://developer.mozilla.org/en-US/docs/Web/API/DeviceLightEvent)
  - [`useDeviceMotion`](https://vueuse.js.org/core/useDeviceMotion) — reactive [DeviceMotionEvent](https://developer.mozilla.org/en-US/docs/Web/API/DeviceMotionEvent)
  - [`useDeviceOrientation`](https://vueuse.js.org/core/useDeviceOrientation) — reactive [DeviceOrientationEvent](https://developer.mozilla.org/en-US/docs/Web/API/DeviceOrientationEvent)
  - [`useDevicePixelRatio`](https://vueuse.js.org/core/useDevicePixelRatio) — reactively track [`window.devicePixelRatio`](https://developer.mozilla.org/ru/docs/Web/API/Window/devicePixelRatio)
  - [`useDocumentVisibility`](https://vueuse.js.org/core/useDocumentVisibility) — reactively track [`document.visibilityState`](https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilityState)
  - [`useElementBounding`](https://vueuse.js.org/core/useElementBounding) — reactive [bounding box](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect) of an HTML element
  - [`useElementSize`](https://vueuse.js.org/core/useElementSize) — reactive size of an HTML element
  - [`useElementVisibility`](https://vueuse.js.org/core/useElementVisibility) — tracks the visibility of an element within the viewport
  - [`useGeolocation`](https://vueuse.js.org/core/useGeolocation) — reactive [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)
  - [`useIdle`](https://vueuse.js.org/core/useIdle) — tracks whether the user is being inactive
  - [`useIntersectionObserver`](https://vueuse.js.org/core/useIntersectionObserver) — detects that a target element's visibility
  - [`useMouse`](https://vueuse.js.org/core/useMouse) — reactive mouse position
  - [`useMouseInElement`](https://vueuse.js.org/core/useMouseInElement) — reactive mouse position related to an element
  - [`useMousePressed`](https://vueuse.js.org/core/useMousePressed) — reactive mouse pressing state
  - [`useMutationObserver`](https://vueuse.js.org/core/useMutationObserver) — watch for changes being made to the DOM tree
  - [`useNetwork`](https://vueuse.js.org/core/useNetwork) — reactive [Network status](https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API)
  - [`useOnline`](https://vueuse.js.org/core/useOnline) — reactive online state
  - [`usePageLeave`](https://vueuse.js.org/core/usePageLeave) — reactive state to show whether the mouse leaves the page
  - [`useParallax`](https://vueuse.js.org/core/useParallax) — create parallax effect easily
  - [`useResizeObserver`](https://vueuse.js.org/core/useResizeObserver) — reports changes to the dimensions of an Element's content or the border-box
  - [`useSpeechRecognition`](https://vueuse.js.org/core/useSpeechRecognition) — reactive [SpeechRecognition](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition)
  - [`useWindowScroll`](https://vueuse.js.org/core/useWindowScroll) — reactive window scroll
  - [`useWindowSize`](https://vueuse.js.org/core/useWindowSize) — reactive window size

- State
  - [`createGlobalState`](https://vueuse.js.org/core/createGlobalState) — keep states in the global scope to be reusable across Vue instances
  - [`useLocalStorage`](https://vueuse.js.org/core/useLocalStorage) — reactive [LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
  - [`useSessionStorage`](https://vueuse.js.org/core/useSessionStorage) — reactive [SessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)
  - [`useStorage`](https://vueuse.js.org/core/useStorage) — reactive [LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)/[SessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)

- Utilities
  - [`asyncComputed`](https://vueuse.js.org/core/asyncComputed) — computed for async functions
  - [`biSyncRef`](https://vueuse.js.org/shared/biSyncRef) — two-way refs synchronization
  - [`controlledComputed`](https://vueuse.js.org/shared/controlledComputed) — explicitly define the deps of computed
  - [`extendRef`](https://vueuse.js.org/shared/extendRef) — add extra attributes to Ref
  - [`makeDestructurable`](https://vueuse.js.org/shared/makeDestructurable) — make isomorphic destructurable for object and array at the same time
  - [`syncRef`](https://vueuse.js.org/shared/syncRef) — keep target refs in sync with a source ref
  - [`useAsyncState`](https://vueuse.js.org/core/useAsyncState) — reactive async state
  - [`useCounter`](https://vueuse.js.org/shared/useCounter) — basic counter with utility functions
  - [`useDebounce`](https://vueuse.js.org/shared/useDebounce) — debounce execution of a ref value
  - [`useDebounceFn`](https://vueuse.js.org/shared/useDebounceFn) — debounce execution of a function
  - [`useManualRefHistory`](https://vueuse.js.org/core/useManualRefHistory) — manually track the change history of a ref when the using calls `commit()`
  - [`useRefHistory`](https://vueuse.js.org/core/useRefHistory) — track the change history of a ref
  - [`useThrottle`](https://vueuse.js.org/shared/useThrottle) — throttle changing of a ref value
  - [`useThrottleFn`](https://vueuse.js.org/shared/useThrottleFn) — throttle execution of a function
  - [`useToggle`](https://vueuse.js.org/shared/useToggle) — a boolean switcher with utility functions

- Watch
  - [`debouncedWatch`](https://vueuse.js.org/shared/debouncedWatch) — debounced watch
  - [`ignorableWatch`](https://vueuse.js.org/shared/ignorableWatch) — ignorable watch
  - [`pausableWatch`](https://vueuse.js.org/shared/pausableWatch) — pausable watch
  - [`throttledWatch`](https://vueuse.js.org/shared/throttledWatch) — throttled watch
  - [`watchWithFilter`](https://vueuse.js.org/shared/watchWithFilter) — `watch` with additional EventFilter control
  - [`when`](https://vueuse.js.org/shared/when) — promised one-time watch for ref changes


<!--FUNCTIONS_LIST_ENDS-->

More functions to be added. Please stay tuned. (PRs are also welcome!)

Meanwhile, try also [**vue-composable**](https://github.com/pikax/vue-composable) by [@pikax](https://github.com/pikax)!

## 🔌 Add-ons

The core package aims to be lightweight and dependence free. While the add-ons are wrapping popular packages into the consistent API style.

<!--GENERATED LIST, DO NOT MODIFY MANUALLY-->
<!--ADDONS_LIST_STARTS-->

- Router ([`@vueuse/router`](https://vueuse.js.org/router/README.html)) - Utilities for vue-router
  - [`useRouteHash`](https://vueuse.js.org/router/useRouteHash) — shorthand for reactive route.hash
  - [`useRouteQuery`](https://vueuse.js.org/router/useRouteQuery) — shorthand for reactive route.query



- Integrations ([`@vueuse/integrations`](https://vueuse.js.org/integrations/README.html)) - Integration wrappers for utility libraries
  - [`useAxios`](https://vueuse.js.org/integrations/useAxios) — wrapper for [`axios`](https://github.com/axios/axios)
  - [`useCookies`](https://vueuse.js.org/integrations/useCookies) — wrapper for [`universal-cookie`](https://www.npmjs.com/package/universal-cookie)
  - [`useNProgress`](https://vueuse.js.org/integrations/useNProgress) — reactive wrapper for [`nprogress`](https://github.com/rstacruz/nprogress)
  - [`useQRCode`](https://vueuse.js.org/integrations/useQRCode) — wrapper for [`qrcode`](https://github.com/soldair/node-qrcode)



- RxJS ([`@vueuse/rxjs`](https://vueuse.js.org/rxjs/README.html)) - Enables RxJS reactive functions in Vue
  - [`from`](https://vueuse.js.org/rxjs/from) — two wrappers around of the original functions to allow use ref objects
  - [`toObserver`](https://vueuse.js.org/rxjs/toObserver) — sugar function to convert a ref in an observer
  - [`useObservable`](https://vueuse.js.org/rxjs/useObservable) — use an Observable
  - [`useSubscription`](https://vueuse.js.org/rxjs/useSubscription) — uses subscriptions without worry about unsubscribing to it or memory leaks



- Firebase ([`@vueuse/firebase`](https://vueuse.js.org/firebase/README.html)) - Enables realtime bindings for Firebase
  - [`useFirestore`](https://vueuse.js.org/firebase/useFirestore) — reactive [Firestore](https://firebase.google.com/docs/firestore) binding
  - [`useRTDB`](https://vueuse.js.org/firebase/useRTDB) — reactive [Firebase Realtime Database](https://firebase.google.com/docs/database) binding


<!--ADDONS_LIST_ENDS-->


## 🧱 Contribute

See the [**Contributing Guide**](https://vueuse.js.org/?path=/story/docs--contributing)

## 🌸 Thanks

This project is heavily inspired by the following awesome projects.

- [streamich/react-use](https://github.com/streamich/react-use)
- [u3u/vue-hooks](https://github.com/u3u/vue-hooks)
- [shuidi-fed/vue-composition-toolkit](https://github.com/shuidi-fed/vue-composition-toolkit)
- [logaretm/vue-use-web](https://github.com/logaretm/vue-use-web)
- [kripod/react-hooks](https://github.com/kripod/react-hooks)

Thanks!


## 👨‍🚀 Contributors

### Code Contributors

This project exists thanks to all the people who contribute. [How to Contribute](https://vueuse.js.org/?path=/story/docs--contributing).

<a href="https://github.com/antfu/vueuse/graphs/contributors"><img src="https://opencollective.com/vueuse/contributors.svg?width=890&button=false" ></a>

### Financial Contributors

Become a financial contributor and help us sustain our community. [Contribute via Open Collective](https://opencollective.com/vueuse/contribute)

#### Individuals

<a href="https://opencollective.com/vueuse"><img src="https://opencollective.com/vueuse/individuals.svg?width=890"></a>

#### Organizations

Support this project with your organization. Your logo will show up here with a link to your website. [[Contribute](https://opencollective.com/vueuse/contribute)]

<a href="https://opencollective.com/vueuse/organization/0/website"><img src="https://opencollective.com/vueuse/organization/0/avatar.svg"></a>
<a href="https://opencollective.com/vueuse/organization/1/website"><img src="https://opencollective.com/vueuse/organization/1/avatar.svg"></a>
<a href="https://opencollective.com/vueuse/organization/2/website"><img src="https://opencollective.com/vueuse/organization/2/avatar.svg"></a>
<a href="https://opencollective.com/vueuse/organization/3/website"><img src="https://opencollective.com/vueuse/organization/3/avatar.svg"></a>
<a href="https://opencollective.com/vueuse/organization/4/website"><img src="https://opencollective.com/vueuse/organization/4/avatar.svg"></a>
<a href="https://opencollective.com/vueuse/organization/5/website"><img src="https://opencollective.com/vueuse/organization/5/avatar.svg"></a>
<a href="https://opencollective.com/vueuse/organization/6/website"><img src="https://opencollective.com/vueuse/organization/6/avatar.svg"></a>
<a href="https://opencollective.com/vueuse/organization/7/website"><img src="https://opencollective.com/vueuse/organization/7/avatar.svg"></a>
<a href="https://opencollective.com/vueuse/organization/8/website"><img src="https://opencollective.com/vueuse/organization/8/avatar.svg"></a>
<a href="https://opencollective.com/vueuse/organization/9/website"><img src="https://opencollective.com/vueuse/organization/9/avatar.svg"></a>

## 📄 License

[MIT License](https://github.com/antfu/vueuse/blob/master/LICENSE) © 2019-2020 [Anthony Fu](https://github.com/antfu)
