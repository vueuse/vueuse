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


## 🚀 Features

- ⚡ **0 dependencies**: No worry about your bundle size
- 🌴 **Fully tree shakable**: Only take what you want
- 🦾 **Type Strong**: Written in Typescript
- 🕶 **Seamless migration**: Works for **both** Vue 3 and 2
- 🌎 **Browser compatible**: Use it though CDN
- 🎪 **Interactive docs & demos**: [Check out the Storybook!](https://vueuse.js.org)
- 🔌 **Optional [Add-ons](#-add-ons)**: Firebase, vue-i18n, etc

## 🦄 Usage

```ts
import { useMouse, usePreferredDark, useLocalStorage } from '@vueuse/core'

new Vue({
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

### for Vue 3 ([vue-next](https://github.com/vuejs/vue-next)), [*demo here*](https://vueuse-next-example.netlify.com/)

<pre>
npm i @vueuse/core<b>@vue3</b>
</pre>

### for Vue 2 with [composition-api](https://github.com/vuejs/composition-api) polyfill

<pre>
npm i @vueuse/core<b>@vue2</b> @vue/composition-api 
</pre>

Please [register the Composition API Plugin](https://github.com/vuejs/composition-api#usage) before using APIs.

### CDN

```html
<!-- For Vue 3 -->
<script src="https://unpkg.com/@vueuse/core@vue3"></script> 

<!-- For Vue 2 -->
<script src="https://unpkg.com/@vueuse/core@vue2"></script>
```

It will be exposed to global as `window.VueUse`


## ⚡ Functions

You can check out the full documents and live demos in [Storybook](https://vueuse.js.org/).

<!--GENEARTED LIST, DO NOT MODIFY MANUALLY-->
<!--FUNCTIONS_LIST_STARTS-->

- Animation
  - [`useInterval`](https://vueuse.js.org/?path=/story/animation--useinterval) — reactive counter increases on every interval
  - [`useIntervalFn`](https://vueuse.js.org/?path=/story/animation--useintervalfn) — simple wrapper for `setInterval`
  - [`useNow`](https://vueuse.js.org/?path=/story/animation--usenow) — reactive current timestamp
  - [`useRaf`](https://vueuse.js.org/?path=/story/animation--useraf) — reactive time elapsed on every `requestAnimationFrame`
  - [`useRafFn`](https://vueuse.js.org/?path=/story/animation--useraffn) — call function on every `requestAnimationFrame`
  - [`useTimeout`](https://vueuse.js.org/?path=/story/animation--usetimeout) — update value after a given time
  - [`useTimeoutFn`](https://vueuse.js.org/?path=/story/animation--usetimeoutfn) — call function after a given time

- Browser
  - [`useBrowserLocation`](https://vueuse.js.org/?path=/story/browser--usebrowserlocation) — reactive browser location
  - [`useClipboard`](https://vueuse.js.org/?path=/story/browser--useclipboard) — reactive [Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)
  - [`useCssVar`](https://vueuse.js.org/?path=/story/browser--usecssvar) — manipulate CSS variables
  - [`useEventListener`](https://vueuse.js.org/?path=/story/browser--useeventlistener) — use EventListener with ease
  - [`useFullscreen`](https://vueuse.js.org/?path=/story/browser--usefullscreen) — reactive [Fullscreen API](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API)
  - [`useMediaQuery`](https://vueuse.js.org/?path=/story/browser--usemediaquery) — reactive [Media Query]((https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Testing_media_queries))
  - [`usePermission`](https://vueuse.js.org/?path=/story/browser--usepermission) — reactive [Permissions API](https://developer.mozilla.org/en-US/docs/Web/API/Permissions_API)
  - [`usePreferredColorScheme`](https://vueuse.js.org/?path=/story/browser--usepreferredcolorscheme) — reactive [prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme) media query
  - [`usePreferredDark`](https://vueuse.js.org/?path=/story/browser--usepreferreddark) — reactive dark theme preference
  - [`usePreferredLanguages`](https://vueuse.js.org/?path=/story/browser--usepreferredlanguages) — reactive [Navigator Languages](https://developer.mozilla.org/en-US/docs/Web/API/NavigatorLanguage/languages)
  - [`useShare`](https://vueuse.js.org/?path=/story/browser--useshare) — reactive [Web Share API](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share)

- Misc
  - [`useWebSocket`](https://vueuse.js.org/?path=/story/misc--usewebsocket) — reactive simple [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/WebSocket) client
  - [`useWebWorker`](https://vueuse.js.org/?path=/story/misc--usewebworker) — simple [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) registration and communication

- Sensors
  - [`useBattery`](https://vueuse.js.org/?path=/story/sensors--usebattery) — reactive [Battery Status API](https://developer.mozilla.org/en-US/docs/Web/API/Battery_Status_API)
  - [`useDeviceLight`](https://vueuse.js.org/?path=/story/sensors--usedevicelight) — reactive [DeviceLightEvent](https://developer.mozilla.org/en-US/docs/Web/API/DeviceLightEvent)
  - [`useDeviceMotion`](https://vueuse.js.org/?path=/story/sensors--usedevicemotion) — reactive [DeviceMotionEvent](https://developer.mozilla.org/en-US/docs/Web/API/DeviceMotionEvent)
  - [`useDeviceOrientation`](https://vueuse.js.org/?path=/story/sensors--usedeviceorientation) — reactive [DeviceOrientationEvent](https://developer.mozilla.org/en-US/docs/Web/API/DeviceOrientationEvent)
  - [`useElementVisibility`](https://vueuse.js.org/?path=/story/sensors--useElementVisibility) — reactive element visibility within viewport
  - [`useGeolocation`](https://vueuse.js.org/?path=/story/sensors--usegeolocation) — reactive [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)
  - [`useMouse`](https://vueuse.js.org/?path=/story/sensors--usemouse) — reactive mouse position
  - [`useMouseInElement`](https://vueuse.js.org/?path=/story/sensors--usemouseinelement) — reactive mouse position in an element
  - [`useNetwork`](https://vueuse.js.org/?path=/story/sensors--usenetwork) — reactive [Network status](https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API)
  - [`useOnline`](https://vueuse.js.org/?path=/story/sensors--useonline) — reactive online state
  - [`usePageLeave`](https://vueuse.js.org/?path=/story/sensors--usepageleave) — reactive state to show whether mouse leaves the page
  - [`useParallax`](https://vueuse.js.org/?path=/story/sensors--useparallax) — create parallax effect easily
  - [`useWindowScroll`](https://vueuse.js.org/?path=/story/sensors--usewindowscroll) — reactive window scroll
  - [`useWindowSize`](https://vueuse.js.org/?path=/story/sensors--usewindowsize) — reactive window size

- State
  - [`createGlobalState`](https://vueuse.js.org/?path=/story/state--createglobalstate) — keep state in global scope to be reused across Vue instances
  - [`useAsyncState`](https://vueuse.js.org/?path=/story/state--useasyncstate) — reactive async state
  - [`useCounter`](https://vueuse.js.org/?path=/story/state--usecounter) — basic counter with utility functions
  - [`useIdle`](https://vueuse.js.org/?path=/story/state--useidle) — tracks whether user is being inactive
  - [`useLocalStorage`](https://vueuse.js.org/?path=/story/state--uselocalstorage) — reactive [LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
  - [`useSessionStorage`](https://vueuse.js.org/?path=/story/state--usesessionstorage) — reactive [SessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)
  - [`useStorage`](https://vueuse.js.org/?path=/story/state--usestorage) — reactive [LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)/[SessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)

<!--FUNCTIONS_LIST_ENDS-->

More functions to be added. Please keep turned. (PRs are also welcome!)

## 🔌 Add-ons

The core package aims to be lightweight and dependence free. While the add-ons are wrapping popular packages into the consistent API style.

<!--GENEARTED LIST, DO NOT MODIFY MANUALLY-->
<!--ADDONS_LIST_STARTS-->
- 🌍 i18n ([`@vueuse/i18n`](https://vueuse.js.org/?path=/story/add-ons-i18n--read-me)) - Composition wrapper for [vue-i18n](https://github.com/kazupon/vue-i18n)
  - [`createI18n`](https://vueuse.js.org/?path=/story/add-ons-i18n--createi18n) — create a global i18n instance to be reused
  - [`useI18n`](https://vueuse.js.org/?path=/story/add-ons-i18n--usei18n) — use vue-i18n instance

- 🔥 Firebase ([`@vueuse/firebase`](https://vueuse.js.org/?path=/story/add-ons-firebase--read-me)) - enables realtime bindings for [Firebase](https://firebase.google.com/)
  - [`useFirestore`](https://vueuse.js.org/?path=/story/add-ons-firebase--usefirestore) — reactive [Firestore](https://firebase.google.com/docs/firestore) binding
  - [`useRTDB`](https://vueuse.js.org/?path=/story/add-ons-firebase--usertdb) — reactive [Firebase Realtime Database](https://firebase.google.com/docs/database) binding
<!--ADDONS_LIST_ENDS-->

## 🔬 Technical Details

### The Versioning

For every release, it will release two versions of this package. The `3.x.x` is used for Vue 3 and the `2.x.x` is used for Vue 2. We use the major version number to distinguish the different target versions will the minor and patch numbers are shared in both packages.

### Different between 3.x and 2.x

For 3.x build, we use the API from [`@vue/runtime-dom`](https://www.npmjs.com/package/@vue/runtime-dom), and for 2.x, it's [`@vue/composition-api`](https://www.npmjs.com/package/@vue/composition-api). All the functions exported in this package behaves the same.

```js
// 3.x build
import { ref } from '@vue/runtime-dom'

// 2.x build
import { ref } from '@vue/composition-api'
```

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

This project exists thanks to all the people who contribute. [[Contribute](CONTRIBUTING.md)].
<a href="https://github.com/antfu/vueuse/graphs/contributors"><img src="https://opencollective.com/vueuse/contributors.svg?width=890&button=false" /></a>

### Financial Contributors

Become a financial contributor and help us sustain our community. [[Contribute](https://opencollective.com/vueuse/contribute)]

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
