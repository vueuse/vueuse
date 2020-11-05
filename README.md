<p align="center">
<a href="https://github.com/antfu/vueuse"><img src="https://raw.githubusercontent.com/antfu/vueuse/master/resources/logo-vertical.png" alt="logo" width="300"/></a>
</p>

<p align="center">
<a href="https://www.npmjs.com/package/@vueuse/core" target="__blank">
<img src="https://img.shields.io/npm/v/@vueuse/core?color=a1b858" alt="NPM version" /></a>
<a href="https://vueuse.js.org" target="__blank"><img src="https://img.shields.io/static/v1?label=storybook&message=demos&color=63ba83" alt="Storybook Demos" /></a>
<a href="https://app.netlify.com/" target="__blank"><img src="https://img.shields.io/static/v1?label=deploys%20by&message=netlify&color=00C7B7" alt="Deploys by Netlify" /></a>
<a href="https://www.npmjs.com/package/@vueuse/core" target="__blank"><img alt="NPM Downloads" src="https://img.shields.io/npm/dm/@vueuse/core?color=35495e"/></a>
<a href="https://github.com/antfu/vueuse" target="__blank"><img src="https://img.shields.io/github/last-commit/antfu/vueuse.svg?color=a38eed" alt="GitHub last commit" /></a>
<a href="https://github.com/antfu/vueuse/issues" target="__blank"><img src="https://img.shields.io/github/issues/antfu/vueuse.svg?color=c977be" alt="GitHub issues" /></a>
<a href="https://github.com/antfu/vueuse" target="__blank"><img alt="GitHub stars" src="https://img.shields.io/github/stars/antfu/vueuse?style=social"></a>
</p>

<p align="center">
Collection of essential Vue Composition API (inspired by <a href='https://github.com/streamich/react-use' target='__blank'>react-use</a>)
</p>

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/antfu/static/sponsors.svg">
    <img src='https://cdn.jsdelivr.net/gh/antfu/static/sponsors.svg'/>
  </a>
</p>


## 🚀 Features

- ⚡ **0 dependencies**: Don't worry about your bundle size
- 🌴 **Fully tree shakable**: Only take what you want
- 🦾 **Type Strong**: Written in Typescript
- 🕶 **Seamless migration**: Works for **both** Vue 3 and 2
- 🌎 **Browser compatible**: Use it through CDN
- 🎪 **Interactive docs & demos**: [Check out the Storybook!](https://vueuse.js.org)
- 🔌 **Optional [Add-ons](#-add-ons)**

## 🦄 Usage

```ts
import { defineComponent } from 'vue'
import { useMouse, usePreferredDark, useLocalStorage } from '@vueuse/core'

const Component = defineComponent({
  setup() {
    // tracks mouse position
    const { x, y } = useMouse()

    // is user prefers dark theme
    const isDark = usePreferredDark()

    // persist state in localStorage
    const state = useLocalStorage(
      'my-storage', 
      {
        name: 'Apple',
        color: 'red',
      },
    )

    return { x, y, isDark, state }
  }
})
```

Refer to [functions list](#-functions) or [documentations](https://vueuse.js.org/) for more details.

## 📦 Install

> 🎩 From v4.0, it works for Vue 2 & 3 **within a single package** by the power of [Vue Demi](https://github.com/antfu/vue-demi)!

```bash
npm i @vueuse/core # yarn add @vueuse/core
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
  - [`useInterval`](https://vueuse.js.org/?path=/story/animation--useinterval) — reactive counter increases on every interval
  - [`useIntervalFn`](https://vueuse.js.org/?path=/story/animation--useintervalfn) — simple wrapper for `setInterval`
  - [`useNow`](https://vueuse.js.org/?path=/story/animation--usenow) — reactive current timestamp
  - [`useRaf`](https://vueuse.js.org/?path=/story/animation--useraf) — reactive time elapsed on every `requestAnimationFrame`
  - [`useRafFn`](https://vueuse.js.org/?path=/story/animation--useraffn) — call function on every `requestAnimationFrame`
  - [`useTimeout`](https://vueuse.js.org/?path=/story/animation--usetimeout) — update value after a given time
  - [`useTimeoutFn`](https://vueuse.js.org/?path=/story/animation--usetimeoutfn) — call function after a given time
  - [`useTransition`](https://vueuse.js.org/?path=/story/animation--usetransition) — transition between values

- Browser
  - [`useBrowserLocation`](https://vueuse.js.org/?path=/story/browser--usebrowserlocation) — reactive browser location
  - [`useClipboard`](https://vueuse.js.org/?path=/story/browser--useclipboard) — reactive [Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)
  - [`useCssVar`](https://vueuse.js.org/?path=/story/browser--usecssvar) — manipulate CSS variables
  - [`useEventListener`](https://vueuse.js.org/?path=/story/browser--useeventlistener) — use EventListener with ease
  - [`useFavicon`](https://vueuse.js.org/?path=/story/browser--usefavicon) — reactive favicon
  - [`useFullscreen`](https://vueuse.js.org/?path=/story/browser--usefullscreen) — reactive [Fullscreen API](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API)
  - [`useMediaQuery`](https://vueuse.js.org/?path=/story/browser--usemediaquery) — reactive [Media Query]((https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Testing_media_queries))
  - [`useMutationObserver`](https://vueuse.js.org/?path=/story/browser--usemutationobserver) — watch for changes being made to the DOM tree
  - [`usePermission`](https://vueuse.js.org/?path=/story/browser--usepermission) — reactive [Permissions API](https://developer.mozilla.org/en-US/docs/Web/API/Permissions_API)
  - [`usePreferredColorScheme`](https://vueuse.js.org/?path=/story/browser--usepreferredcolorscheme) — reactive [prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme) media query
  - [`usePreferredDark`](https://vueuse.js.org/?path=/story/browser--usepreferreddark) — reactive dark theme preference
  - [`usePreferredLanguages`](https://vueuse.js.org/?path=/story/browser--usepreferredlanguages) — reactive [Navigator Languages](https://developer.mozilla.org/en-US/docs/Web/API/NavigatorLanguage/languages)
  - [`useResizeObserver`](https://vueuse.js.org/?path=/story/browser--useresizeobserver) — reports changes to the dimensions of an Element's content or the border-box
  - [`useShare`](https://vueuse.js.org/?path=/story/browser--useshare) — reactive [Web Share API](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share)
  - [`useTitle`](https://vueuse.js.org/?path=/story/browser--usetitle) — reactive document title

- Misc
  - [`useEventSource`](https://vueuse.js.org/?path=/story/misc--useeventsource) — an [EventSource](https://developer.mozilla.org/en-US/docs/Web/API/EventSource) or [Server-Sent-Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events) instance opens a persistent connection to an HTTP server
  - [`useWebSocket`](https://vueuse.js.org/?path=/story/misc--usewebsocket) — reactive simple [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/WebSocket) client
  - [`useWebWorker`](https://vueuse.js.org/?path=/story/misc--usewebworker) — simple [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) registration and communication
  - [`useWebWorkerFn`](https://vueuse.js.org/?path=/story/misc--usewebworkerfn) — run expensive function without blocking the UI

- Sensors
  - [`onStartTyping`](https://vueuse.js.org/?path=/story/sensors--onstarttyping) — fires when users start typing on non-editable elements
  - [`useBattery`](https://vueuse.js.org/?path=/story/sensors--usebattery) — reactive [Battery Status API](https://developer.mozilla.org/en-US/docs/Web/API/Battery_Status_API)
  - [`useDeviceLight`](https://vueuse.js.org/?path=/story/sensors--usedevicelight) — reactive [DeviceLightEvent](https://developer.mozilla.org/en-US/docs/Web/API/DeviceLightEvent)
  - [`useDeviceMotion`](https://vueuse.js.org/?path=/story/sensors--usedevicemotion) — reactive [DeviceMotionEvent](https://developer.mozilla.org/en-US/docs/Web/API/DeviceMotionEvent)
  - [`useDeviceOrientation`](https://vueuse.js.org/?path=/story/sensors--usedeviceorientation) — reactive [DeviceOrientationEvent](https://developer.mozilla.org/en-US/docs/Web/API/DeviceOrientationEvent)
  - [`useDevicePixelRatio`](https://vueuse.js.org/?path=/story/sensors--usedevicepixelratio) — reactively track [`Window.devicePixelRatio`](https://developer.mozilla.org/ru/docs/Web/API/Window/devicePixelRatio)
  - [`useDocumentVisibility`](https://vueuse.js.org/?path=/story/sensors--usedocumentvisibility) — reactively track [`Document.visibilityState`](https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilityState)
  - [`useElementVisibility`](https://vueuse.js.org/?path=/story/sensors--useelementvisibility) — tracks the visibility of an element within the viewport
  - [`useGeolocation`](https://vueuse.js.org/?path=/story/sensors--usegeolocation) — reactive [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)
  - [`useIdle`](https://vueuse.js.org/?path=/story/sensors--useidle) — tracks whether the user is being inactive
  - [`useIntersectionObserver`](https://vueuse.js.org/?path=/story/sensors--useintersectionobserver) — detects that a target element's visibility
  - [`useMouse`](https://vueuse.js.org/?path=/story/sensors--usemouse) — reactive mouse position
  - [`useMouseInElement`](https://vueuse.js.org/?path=/story/sensors--usemouseinelement) — reactive mouse position in an element
  - [`useNetwork`](https://vueuse.js.org/?path=/story/sensors--usenetwork) — reactive [Network status](https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API)
  - [`useOnline`](https://vueuse.js.org/?path=/story/sensors--useonline) — reactive online state
  - [`usePageLeave`](https://vueuse.js.org/?path=/story/sensors--usepageleave) — reactive state to show whether mouse leaves the page
  - [`useParallax`](https://vueuse.js.org/?path=/story/sensors--useparallax) — create parallax effect easily
  - [`useSpeechRecognition`](https://vueuse.js.org/?path=/story/sensors--usespeechrecognition) — reactive [SpeechRecognition](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition)
  - [`useWindowScroll`](https://vueuse.js.org/?path=/story/sensors--usewindowscroll) — reactive window scroll
  - [`useWindowSize`](https://vueuse.js.org/?path=/story/sensors--usewindowsize) — reactive window size

- State
  - [`createGlobalState`](https://vueuse.js.org/?path=/story/state--createglobalstate) — keep states in the global scope to be reused across Vue instances
  - [`useCounter`](https://vueuse.js.org/?path=/story/state--usecounter) — basic counter with utility functions
  - [`useLocalStorage`](https://vueuse.js.org/?path=/story/state--uselocalstorage) — reactive [LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
  - [`useSessionStorage`](https://vueuse.js.org/?path=/story/state--usesessionstorage) — reactive [SessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)
  - [`useStorage`](https://vueuse.js.org/?path=/story/state--usestorage) — reactive [LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)/[SessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)

- Utilities
  - [`asyncComputed`](https://vueuse.js.org/?path=/story/utilities--asynccomputed) — like [computed refs](https://composition-api.vuejs.org/api.html#computed)
  - [`biSyncRef`](https://vueuse.js.org/?path=/story/utilities--bisyncref) — two-way refs synchronization
  - [`controlledComputed`](https://vueuse.js.org/?path=/story/utilities--controlledcomputed) — explicitly define the deps of computed
  - [`extendRef`](https://vueuse.js.org/?path=/story/utilities--extendref) — add extra attributes to Ref
  - [`makeDestructurable`](https://vueuse.js.org/?path=/story/utilities--makedestructurable) — make isomorphic destructurable for object and array at the same time
  - [`syncRef`](https://vueuse.js.org/?path=/story/utilities--syncref) — keep target refs in sync with a source ref
  - [`tryOnMounted`](https://vueuse.js.org/?path=/story/utilities--tryonmounted) — safe `onMounted`
  - [`tryOnUnmounted`](https://vueuse.js.org/?path=/story/utilities--tryonunmounted) — safe `onUnmounted`
  - [`useAsyncState`](https://vueuse.js.org/?path=/story/utilities--useasyncstate) — reactive async state
  - [`useDebounce`](https://vueuse.js.org/?path=/story/utilities--usedebounce) — debounce execution of a ref value
  - [`useDebounceFn`](https://vueuse.js.org/?path=/story/utilities--usedebouncefn) — debounce execution of a function
  - [`useRefHistory`](https://vueuse.js.org/?path=/story/utilities--userefhistory) — track the change history of a ref
  - [`useThrottle`](https://vueuse.js.org/?path=/story/utilities--usethrottle) — throttle changing of a ref value
  - [`useThrottleFn`](https://vueuse.js.org/?path=/story/utilities--usethrottlefn) — throttle execution of a function
  - [`when`](https://vueuse.js.org/?path=/story/utilities--when) — promised one-time watch for ref changes

<!--FUNCTIONS_LIST_ENDS-->

More functions to be added. Please stay tuned. (PRs are also welcome!)

Meanwhile, try also [**vue-composable**](https://github.com/pikax/vue-composable) by [@pikax](https://github.com/pikax)!

## 🔌 Add-ons

The core package aims to be lightweight and dependence free. While the add-ons are wrapping popular packages into the consistent API style.

<!--GENERATED LIST, DO NOT MODIFY MANUALLY-->
<!--ADDONS_LIST_STARTS-->


- Integrations ([`@vueuse/integrations`](https://vueuse.js.org/?path=/story/integrations--readme)) - Integration wrappers for utility libraries
  - [`useAxios`](https://vueuse.js.org/?path=/story/integrations--useaxios) — wrapper for [`axios`](https://github.com/axios/axios)
  - [`useCookies`](https://vueuse.js.org/?path=/story/integrations--usecookies) — wrapper for [`universal-cookie`](https://www.npmjs.com/package/universal-cookie)
  - [`useQRCode`](https://vueuse.js.org/?path=/story/integrations--useqrcode) — wrapper for [`qrcode`](https://github.com/soldair/node-qrcode)



- RxJS ([`@vueuse/rxjs`](https://vueuse.js.org/?path=/story/rxjs--readme)) - Enables RxJS reactive functions in Vue
  - [`from`](https://vueuse.js.org/?path=/story/rxjs--from) — two wrappers around of the original functions to allow use ref objects
  - [`toObserver`](https://vueuse.js.org/?path=/story/rxjs--toobserver) — sugar function to convert a ref in an observer
  - [`useObservable`](https://vueuse.js.org/?path=/story/rxjs--useobservable) — use an Observable
  - [`useSubscription`](https://vueuse.js.org/?path=/story/rxjs--usesubscription) — uses subscriptions without worry about unsubscribing to it or memory leaks



- Firebase ([`@vueuse/firebase`](https://vueuse.js.org/?path=/story/firebase--readme)) - Enables realtime bindings for Firebase
  - [`useFirestore`](https://vueuse.js.org/?path=/story/@firebase--usefirestore) — reactive [Firestore](https://firebase.google.com/docs/firestore) binding
  - [`useRTDB`](https://vueuse.js.org/?path=/story/@firebase--usertdb) — reactive [Firebase Realtime Database](https://firebase.google.com/docs/database) binding

<!--ADDONS_LIST_ENDS-->


## 🧱 Contribute

See the [**Contributing Guide**](https://vueuse.js.org/?path=/story/docs--contribute)

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

This project exists thanks to all the people who contribute. [How to Contribute](https://vueuse.js.org/?path=/story/docs--contribute).

<a href="https://github.com/antfu/vueuse/graphs/contributors"><img src="https://opencollective.com/vueuse/contributors.svg?width=890&button=false" /></a>

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
