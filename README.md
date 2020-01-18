<p align="center">
<a href="https://github.com/antfu/vueuse"><img src="https://raw.githubusercontent.com/antfu/vueuse/master/resources/logo-vertical.png" alt="logo" width="300"/></a>
</p>

<p align="center">
<a href="https://www.npmjs.com/package/@vueuse/core" target="__blank">
<img src="https://img.shields.io/npm/v/@vueuse/core?color=a1b858" alt="NPM version" /></a>
<a href="https://vueuse.js.org" target="__blank"><img src="https://img.shields.io/static/v1?label=storybook&message=demos&color=63ba83" alt="Storybook Demos" /></a>
<img alt="NPM Downloads" src="https://img.shields.io/npm/dm/@vueuse/core?color=35495e"/>
<a href="https://github.com/antfu/vueuse" target="__blank"><img src="https://img.shields.io/github/last-commit/antfu/vueuse.svg?color=a38eed" alt="GitHub last commit" /></a>
<a href="https://github.com/antfu/vueuse/issues" target="__blank"><img src="https://img.shields.io/github/issues/antfu/vueuse.svg?color=c977be" alt="GitHub issues" /></a>
<a href="https://github.com/antfu/vueuse" target="__blank"><img alt="GitHub stars" src="https://img.shields.io/github/stars/antfu/vueuse?style=social"></a>
</p>


<p align="center">
Collection of essential Vue Composition API (inspired by <a href='https://github.com/streamich/react-use' target='__blank'>react-use</a>)
</p>


## 🚀 Features

- 0 dependencies ⚡ No worry about your bundle size
- Fully tree shakable 🌴 Only take what you want
- Seamless migration 🕶 Works for **both** Vue 3.x and 2.x
- Browser compatible 🌐 Use it without complex building tools
- Intractive docs & demos 🎪 [Check out the Storybook!](https://vueuse.js.org)
- Optional [Add-ons](#-add-ons) 🔌 Firebase, vue-i18n, etc

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

Refer to [functions](#-functions) and [documentations](https://vueuse.js.org/) for more details.

## 📦 Install

### for Vue 3.x ([vue-next](https://github.com/vuejs/vue-next)), [*demo here*](https://vueuse-next-example.netlify.com/)

```bash
npm i @vueuse/core@vue3
```

### for Vue 2.x with [composition-api](https://github.com/vuejs/composition-api) polyfill

```bash
npm i @vue/composition-api @vueuse/core@vue2
```

Please [register the Composition API Plugin](https://github.com/vuejs/composition-api#usage) before using APIs.

### CDN

```html
<!-- For Vue 3.x -->
<script src="https://unpkg.com/@vueuse/core@vue3"></script> 

<!-- For Vue 2.x -->
<script src="https://unpkg.com/@vueuse/core@vue2"></script>
```

It will be exposed to global variable as `window.VueUse`


## ⚡ Functions

You can checkout the full documents and live demos in [Storybook](https://vueuse.js.org/).

<!--GENEARTED LIST, DO NOT MODIFY MANUALLY-->
<!--FUNCTIONS_LIST_STARTS-->

- Animation
  - [`useInterval`](https://vueuse.js.org/?path=/story/animation--useinterval)
  - [`useIntervalFn`](https://vueuse.js.org/?path=/story/animation--useintervalfn)
  - [`useNow`](https://vueuse.js.org/?path=/story/animation--usenow)
  - [`useRaf`](https://vueuse.js.org/?path=/story/animation--useraf)
  - [`useRafFn`](https://vueuse.js.org/?path=/story/animation--useraffn)
  - [`useTimeout`](https://vueuse.js.org/?path=/story/animation--usetimeout)
  - [`useTimeoutFn`](https://vueuse.js.org/?path=/story/animation--usetimeoutfn)

- Browser
  - [`useBrowserLocation`](https://vueuse.js.org/?path=/story/browser--usebrowserlocation)
  - [`useClipboard`](https://vueuse.js.org/?path=/story/browser--useclipboard)
  - [`useCssVar`](https://vueuse.js.org/?path=/story/browser--usecssvar)
  - [`useEventListener`](https://vueuse.js.org/?path=/story/browser--useeventlistener)
  - [`useFullscreen`](https://vueuse.js.org/?path=/story/browser--usefullscreen)
  - [`useMediaQuery`](https://vueuse.js.org/?path=/story/browser--usemediaquery)
  - [`usePermission`](https://vueuse.js.org/?path=/story/browser--usepermission)
  - [`usePreferredColorScheme`](https://vueuse.js.org/?path=/story/browser--usepreferredcolorscheme)
  - [`usePreferredDark`](https://vueuse.js.org/?path=/story/browser--usepreferreddark)
  - [`usePreferredLanguages`](https://vueuse.js.org/?path=/story/browser--usepreferredlanguages)

- Misc
  - [`useWebSocket`](https://vueuse.js.org/?path=/story/misc--usewebsocket)
  - [`useWebWorker`](https://vueuse.js.org/?path=/story/misc--usewebworker)

- Sensors
  - [`useBattery`](https://vueuse.js.org/?path=/story/sensors--usebattery)
  - [`useDeviceLight`](https://vueuse.js.org/?path=/story/sensors--usedevicelight)
  - [`useDeviceMotion`](https://vueuse.js.org/?path=/story/sensors--usedevicemotion)
  - [`useDeviceOrientation`](https://vueuse.js.org/?path=/story/sensors--usedeviceorientation)
  - [`useGeolocation`](https://vueuse.js.org/?path=/story/sensors--usegeolocation)
  - [`useMouse`](https://vueuse.js.org/?path=/story/sensors--usemouse)
  - [`useMouseInElement`](https://vueuse.js.org/?path=/story/sensors--usemouseinelement)
  - [`useNetwork`](https://vueuse.js.org/?path=/story/sensors--usenetwork)
  - [`useOnline`](https://vueuse.js.org/?path=/story/sensors--useonline)
  - [`usePageLeave`](https://vueuse.js.org/?path=/story/sensors--usepageleave)
  - [`useParallax`](https://vueuse.js.org/?path=/story/sensors--useparallax)
  - [`useWindowScroll`](https://vueuse.js.org/?path=/story/sensors--usewindowscroll)
  - [`useWindowSize`](https://vueuse.js.org/?path=/story/sensors--usewindowsize)

- State
  - [`createGlobalState`](https://vueuse.js.org/?path=/story/state--createglobalstate)
  - [`useAsyncState`](https://vueuse.js.org/?path=/story/state--useasyncstate)
  - [`useCounter`](https://vueuse.js.org/?path=/story/state--usecounter)
  - [`useIdle`](https://vueuse.js.org/?path=/story/state--useidle)
  - [`useLocalStorage`](https://vueuse.js.org/?path=/story/state--uselocalstorage)
  - [`useSessionStorage`](https://vueuse.js.org/?path=/story/state--usesessionstorage)
  - [`useStorage`](https://vueuse.js.org/?path=/story/state--usestorage)
  - [`useStoragePlain`](https://vueuse.js.org/?path=/story/state--usestorageplain)

<!--FUNCTIONS_LIST_ENDS-->

More functions to be added. Please keep turned. (PRs are also welcome!)

## 🔌 Add-ons

The core package aims to be lightweight and dependence free. While the add-ons are wrapping popular packages into the consistent API style.

<!--GENEARTED LIST, DO NOT MODIFY MANUALLY-->
<!--ADDONS_LIST_STARTS-->
- 🌍 i18n ([`@vueuse/i18n`](https://vueuse.js.org/?path=/story/add-ons-i18n--read-me)) - Composition wrapper for [vue-i18n](https://github.com/kazupon/vue-i18n)
  - [`createI18n`](https://vueuse.js.org/?path=/story/add-ons-i18n--createi18n)
  - [`useI18n`](https://vueuse.js.org/?path=/story/add-ons-i18n--usei18n)

- 🔥 Firebase ([`@vueuse/firebase`](https://vueuse.js.org/?path=/story/add-ons-firebase--read-me)) - enables realtime bindings for [Firebase](https://firebase.google.com/)
  - [`useFirestore`](https://vueuse.js.org/?path=/story/add-ons-firebase--usefirestore)
  - [`useRTDB`](https://vueuse.js.org/?path=/story/add-ons-firebase--usertdb)
<!--ADDONS_LIST_ENDS-->

## 🔬 Technical Details

### The Versioning

For every release, it will release two version of this package. The `3.x.x` is used for Vue 3.x and the `2.x.x` is used for 2.x. We use the major version number to distinguish the different target version will the minor and patch numbers are shared in both packages.

### Different between 3.x and 2.x

Since the Composition API will be available in 3.x. Using it in 2.x require you use a polyfill. For 3.x build, we use the API from [`@vue/runtime-dom`](https://www.npmjs.com/package/@vue/runtime-dom), and for 2.x, it's [`@vue/composition-api`](https://www.npmjs.com/package/@vue/composition-api). All the functions exported in this package behaves the same.

```js
// 3.x build
import { ref } from '@vue/runtime-dom'

// 2.x build
import { ref } from '@vue/composition-api'
```

## 🧱 Contribute

See the [**Contributing Guide**](https://vueuse.js.org/?path=/story/docs--contribute)

## 🌸 Thanks

This project is heavily inspired by following awesome projects.

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
